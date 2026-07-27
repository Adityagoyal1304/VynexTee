import os
import logging
import httpx
from pathlib import Path
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings

try:
    from langchain_chroma import Chroma
except ImportError:
    from langchain_community.vectorstores import Chroma

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chatbot.ingest")

CHROMA_DIR = str(Path(__file__).parent / "chroma_db")


def get_embeddings() -> GoogleGenerativeAIEmbeddings:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set")
    return GoogleGenerativeAIEmbeddings(
        model=os.getenv("GEMINI_EMBEDDING_MODEL", "models/embedding-001"),
        google_api_key=api_key,
    )


def build_vectorstore() -> int:
    """
    Fetch products from the Express API, create LangChain Document objects,
    and persist them into a local Chroma vector store.
    """
    express_url = os.getenv("EXPRESS_API_URL", "http://localhost:5000").rstrip("/")
    url = f"{express_url}/api/products"
    logger.info(f"Fetching products from {url}...")

    with httpx.Client(timeout=5.0) as client:
        response = client.get(url)
        response.raise_for_status()
        products = response.json()

    if not isinstance(products, list):
        raise ValueError("Expected list of products from Express API")

    documents = []
    for p in products:
        name = p.get("name", "Unknown")
        category = p.get("category", "")
        price_raw = p.get("price", 0)
        try:
            price = float(price_raw)
        except (ValueError, TypeError):
            price = 0.0

        description = p.get("description", "")
        sizes_val = p.get("sizes", [])
        sizes = ", ".join(sizes_val) if isinstance(sizes_val, list) else str(sizes_val)
        stock = p.get("stock", 0)

        page_content = (
            f"Name: {name}. Category: {category}. Price: ₹{price}. "
            f"Description: {description}. Sizes: {sizes}. In stock: {stock}"
        )

        metadata = {
            "id": str(p.get("_id", "")),
            "name": str(name),
            "category": str(category),
            "price": price,
        }
        documents.append(Document(page_content=page_content, metadata=metadata))

    embeddings = get_embeddings()

    os.makedirs(CHROMA_DIR, exist_ok=True)
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
    )
    if hasattr(vectorstore, "persist"):
        vectorstore.persist()

    logger.info(f"Successfully built Chroma vector store with {len(documents)} documents.")
    return len(documents)


def get_retriever():
    """
    Load the persisted Chroma vector store and return a k=4 retriever.
    If the vectorstore directory does not exist, attempt to build it first.
    """
    if not Path(CHROMA_DIR).exists():
        logger.info("chroma_db not found when loading retriever. Attempting to ingest catalog...")
        try:
            build_vectorstore()
        except Exception as e:
            logger.warning(f"On-demand ingestion failed: {e}")

    embeddings = get_embeddings()
    vectorstore = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings,
    )
    return vectorstore.as_retriever(search_kwargs={"k": 4})
