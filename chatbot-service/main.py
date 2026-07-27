import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import List, Literal
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage

from ingest import build_vectorstore
from chain import run_chat_chain

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chatbot.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    chroma_path = Path(__file__).parent / "chroma_db"
    if not chroma_path.exists():
        logger.info("chroma_db directory not found on startup. Attempting automatic product ingestion...")
        try:
            build_vectorstore()
        except Exception as e:
            logger.warning(f"Automatic startup ingestion failed (Express API might be down): {e}. Booting service anyway.")
    yield


app = FastAPI(
    title="VynexTee Chatbot Microservice",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[HistoryItem] = []


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/refresh")
async def refresh_catalog():
    try:
        count = build_vectorstore()
        return {"status": "success", "count": count}
    except Exception as e:
        logger.error("Error refreshing product catalog: %s", str(e))
        return JSONResponse(
            status_code=502,
            content={"error": "Failed to refresh product catalog"}
        )


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not request.message.strip():
        return JSONResponse(
            status_code=400,
            content={"error": "Message cannot be empty"}
        )

    # Cap history at the last 10 messages
    recent_history = request.history[-10:] if request.history else []
    lc_history = []
    for item in recent_history:
        if item.role == "user":
            lc_history.append(HumanMessage(content=item.content))
        else:
            lc_history.append(AIMessage(content=item.content))

    try:
        reply = run_chat_chain(question=request.message, history=lc_history)
        return {"reply": reply}
    except Exception as e:
        logger.error("Error executing chat chain: %s", str(e))
        return JSONResponse(
            status_code=502,
            content={"error": "Chatbot temporarily unavailable"}
        )
