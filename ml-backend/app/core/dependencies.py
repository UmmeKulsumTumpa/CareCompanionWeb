from functools import lru_cache
from app.core.config import settings
from app.vectorstore.retriever import VectorStoreRetriever
from app.services.inference_service import InferenceService


@lru_cache(maxsize=1)
def get_retriever() -> VectorStoreRetriever:
    return VectorStoreRetriever(
        persist_dir=settings.chroma_persist_dir,
        collection_name=settings.chroma_collection_name,
        embedding_model_name=settings.embedding_model_name,
        top_k=settings.rag_top_k,
        similarity_threshold=settings.rag_similarity_threshold,
    )


@lru_cache(maxsize=1)
def get_inference_service() -> InferenceService:
    return InferenceService(
        model_name=settings.hf_model_name,
        hf_token=settings.hf_token,
        max_new_tokens=settings.max_new_tokens,
        temperature=settings.temperature,
        top_p=settings.top_p,
    )
