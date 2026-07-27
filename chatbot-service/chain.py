import os
from operator import itemgetter
from typing import List
from dotenv import load_dotenv
from langchain_core.messages import BaseMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from ingest import get_retriever

load_dotenv()

SYSTEM_PROMPT = """You are a friendly and helpful AI shopping assistant for VynexTee, a premium MERN e-commerce store specializing in T-shirts and bags.
Answer the user's question ONLY from the provided product catalog context below.
If the answer is not found in the context, politely say that you don't know and suggest browsing the VynexTee catalog.
Keep your answers short, concise, and easy to read.
All prices are in INR (₹).
Never invent products, prices, discounts, or stock that are not in the context.

Product Catalog Context:
{context}"""

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}"),
    ]
)


def format_docs(docs) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


def get_llm():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set")
    return ChatGoogleGenerativeAI(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        temperature=0.3,
        google_api_key=api_key,
    )


def run_chat_chain(question: str, history: List[BaseMessage]) -> str:
    """
    Run the RAG LCEL chain for the given human question and conversation history.
    """
    retriever = get_retriever()
    llm = get_llm()

    chain = (
        {
            "context": itemgetter("question") | retriever | format_docs,
            "history": itemgetter("history"),
            "question": itemgetter("question"),
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain.invoke({"question": question, "history": history})
