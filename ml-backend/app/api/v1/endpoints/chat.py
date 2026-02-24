from fastapi import APIRouter, Depends, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.pipelines.chat_pipeline import ChatPipeline
from app.services.rag_service import RAGService
from app.core.dependencies import get_retriever, get_inference_service
from app.core.config import settings

router = APIRouter()


def get_chat_pipeline(
    retriever=Depends(get_retriever),
    inference_service=Depends(get_inference_service),
) -> ChatPipeline:
    rag_service = RAGService(
        retriever=retriever,
        related_experience_threshold=settings.related_experience_threshold,
    )
    return ChatPipeline(inference_service=inference_service, rag_service=rag_service)


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, pipeline: ChatPipeline = Depends(get_chat_pipeline)):
    try:
        return pipeline.run(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
