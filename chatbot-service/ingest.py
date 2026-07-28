import os
import logging
import httpx
from pathlib import Path
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chatbot.ingest")

VECTORSTORE_FILE = str(Path(__file__).parent / "vectorstore.json")

_embeddings = None
_retriever = None


def get_embeddings() -> GoogleGenerativeAIEmbeddings:
    global _embeddings
    if _embeddings is not None:
        return _embeddings
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set")
    _embeddings = GoogleGenerativeAIEmbeddings(
        model=os.getenv("GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001"),
        google_api_key=api_key,
    )
    return _embeddings


def build_vectorstore() -> int:
    """
    Fetch products from the Express API, create LangChain Document objects,
    and persist them into a local InMemoryVectorStore dumped to JSON.
    """
    global _retriever
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
        availability = "In Stock" if (isinstance(stock, (int, float)) and stock > 0) else "Out of Stock"

        page_content = (
            f"Name: {name}. Category: {category}. Price: ₹{price}. "
            f"Description: {description}. Sizes: {sizes}. Availability: {availability}"
        )

        metadata = {
            "id": str(p.get("_id", "")),
            "name": str(name),
            "category": str(category),
            "price": price,
        }
        documents.append(Document(page_content=page_content, metadata=metadata))

    embeddings = get_embeddings()

    vectorstore = InMemoryVectorStore.from_documents(
        documents=documents,
        embedding=embeddings,
    )
    vectorstore.dump(VECTORSTORE_FILE)
    _retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    logger.info(f"Successfully built InMemoryVectorStore with {len(documents)} documents.")
    return len(documents)


def get_retriever():
    """
    Load the persisted InMemoryVectorStore and return a k=4 retriever.
    If the vectorstore file does not exist, attempt to build it first.
    """
    global _retriever
    if _retriever is not None:
        return _retriever

    if not Path(VECTORSTORE_FILE).exists():
        logger.info("vectorstore.json not found when loading retriever. Attempting to ingest catalog...")
        try:
            build_vectorstore()
        except Exception as e:
            logger.warning(f"On-demand ingestion failed: {e}")

    embeddings = get_embeddings()
    vectorstore = InMemoryVectorStore.load(
        VECTORSTORE_FILE,
        embedding=embeddings,
    )
    _retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    return _retriever

