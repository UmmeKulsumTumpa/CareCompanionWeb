import chromadb
from chromadb.config import Settings
from app.vectorstore.embedder import Embedder
from typing import List, Dict


class VectorStoreRetriever:
    def __init__(
        self,
        persist_dir: str,
        collection_name: str,
        embedding_model_name: str,
        top_k: int,
        similarity_threshold: float,
    ):
        self._client = chromadb.PersistentClient(
            path=persist_dir,
            settings=Settings(anonymized_telemetry=False),
        )
        self._collection = self._client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )
        self._embedder = Embedder(embedding_model_name)
        self._top_k = top_k
        self._similarity_threshold = similarity_threshold

    def retrieve(self, query: str, threshold_override: float = None) -> List[Dict]:
        threshold = threshold_override if threshold_override is not None else self._similarity_threshold
        query_embedding = self._embedder.embed_one(query)

        results = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=self._top_k,
            include=["documents", "metadatas", "distances"],
        )

        retrieved = []
        for i, doc in enumerate(results["documents"][0]):
            distance = results["distances"][0][i]
            similarity = 1 - distance
            if similarity >= threshold:
                retrieved.append(
                    {
                        "text": doc,
                        "source": results["metadatas"][0][i].get("source", ""),
                        "url": results["metadatas"][0][i].get("url", ""),
                        "topic": results["metadatas"][0][i].get("topic", ""),
                        "similarity_score": round(similarity, 4),
                    }
                )

        return retrieved
