import chromadb
from chromadb.config import Settings
from app.vectorstore.embedder import Embedder
from typing import List, Dict


class VectorStoreBuilder:
    def __init__(self, persist_dir: str, collection_name: str, embedding_model_name: str):
        self._client = chromadb.PersistentClient(
            path=persist_dir,
            settings=Settings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )
        self._embedder = Embedder(embedding_model_name)

    def add_documents(self, documents: List[Dict]):
        ids = [doc["id"] for doc in documents]
        texts = [doc["text"] for doc in documents]
        metadatas = [
            {
                "source": doc.get("source", ""),
                "url": doc.get("url", ""),
                "topic": doc.get("topic", ""),
                "scraped_at": doc.get("scraped_at", ""),
            }
            for doc in documents
        ]
        embeddings = self._embedder.embed(texts)

        self._collection.upsert(
            ids=ids,
            documents=texts,
            metadatas=metadatas,
            embeddings=embeddings,
        )

    def get_collection_count(self) -> int:
        return self._collection.count()
