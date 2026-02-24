from app.vectorstore.retriever import VectorStoreRetriever
from typing import List, Dict


class RAGService:
    def __init__(self, retriever: VectorStoreRetriever, related_experience_threshold: float):
        self._retriever = retriever
        self._related_experience_threshold = related_experience_threshold

    def get_context(self, query: str) -> List[Dict]:
        return self._retriever.retrieve(query)

    def get_related_experiences(self, query: str) -> List[Dict]:
        return self._retriever.retrieve(
            query, threshold_override=self._related_experience_threshold
        )

    def deduplicate_sources(self, chunks: List[Dict]) -> List[Dict]:
        seen_urls = set()
        unique_sources = []
        for chunk in chunks:
            url = chunk.get("url", "")
            source = chunk.get("source", "")
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique_sources.append({"name": source, "url": url})
        return unique_sources
