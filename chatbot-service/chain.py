import os
from typing import List
from dotenv import load_dotenv
from langchain_core.messages import BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableLambda
from langchain_google_genai import ChatGoogleGenerativeAI
from ingest import get_retriever

load_dotenv()

SYSTEM_PROMPT = """You are a friendly and helpful AI shopping assistant for VynexTee, a premium MERN e-commerce store specializing in T-shirts and bags.
Answer the user's question ONLY from the provided product catalog context below.
If the answer is not found in the context, politely say that you don't know and suggest browsing the VynexTee catalog.
Keep your answers short, concise, and easy to read.
All prices are in INR (₹).
Never invent products, prices, discounts, or stock that are not in the context.

IMPORTANT CUSTOMER PRIVACY & BUSINESS RULES:
- Never reveal internal inventory counts, exact stock numbers, database IDs, or internal product codes even if asked.
- If a customer asks how many products or designs are available, count the number of distinct product styles/designs in the catalog (do NOT sum or mention stock quantities).
- If a customer asks about availability, only state whether an item is 'In Stock' or 'Out of Stock'.

Product Catalog Context:
{context}"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="history", optional=True),
        ("human", "{question}"),
    ]
)


def format_docs(docs) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


def get_question(input_dict: dict) -> str:
    return input_dict.get("question", "")


def get_history(input_dict: dict) -> List[BaseMessage]:
    return input_dict.get("history", [])


_llm = None

def get_llm():
    global _llm
    if _llm is not None:
        return _llm
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set")
    # Using gemini-flash-latest as the standard free tier flash model in Google GenAI
    model_name = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
    _llm = ChatGoogleGenerativeAI(
        model=model_name,
        temperature=0.3,
        google_api_key=api_key,
    )
    return _llm



def run_chat_chain(question: str, history: List[BaseMessage]) -> str:
    """
    Run the RAG LCEL chain for the given human question and conversation history.
    """
    retriever = get_retriever()
    llm = get_llm()

    chain = (
        {
            "context": RunnableLambda(get_question) | retriever | format_docs,
            "history": RunnableLambda(get_history),
            "question": RunnableLambda(get_question),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain.invoke({"question": question, "history": history})
