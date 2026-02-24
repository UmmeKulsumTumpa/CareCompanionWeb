from app.services.inference_service import InferenceService
from app.services.rag_service import RAGService
from app.services.refinement_service import RefinementService
from app.schemas.chat import ChatRequest, ChatResponse, RelatedExperience, SourceReference
from app.core.config import settings


class ChatPipeline:
    def __init__(
        self,
        inference_service: InferenceService,
        rag_service: RAGService,
    ):
        self._inference = inference_service
        self._rag = rag_service
        self._refinement = RefinementService()

    def run(self, request: ChatRequest) -> ChatResponse:
        rag_chunks = self._rag.get_context(request.query)

        history = [turn.dict() for turn in request.chat_history] if request.chat_history else []

        prompt = self._inference.build_prompt(
            query=request.query,
            rag_context=rag_chunks,
            chat_history=history,
        )

        raw_answer = self._inference.generate(prompt)
        refined_answer = self._refinement.refine(raw_answer, rag_chunks)

        sources = [
            SourceReference(name=s["name"], url=s["url"])
            for s in self._rag.deduplicate_sources(rag_chunks)
        ]

        related_experiences = []
        if request.include_related_experiences:
            high_confidence_chunks = self._rag.get_related_experiences(request.query)
            related_experiences = [
                RelatedExperience(
                    text=chunk["text"],
                    source=chunk["source"],
                    url=chunk["url"],
                    similarity_score=chunk["similarity_score"],
                )
                for chunk in high_confidence_chunks
            ]

        return ChatResponse(
            answer=refined_answer,
            sources=sources,
            related_experiences=related_experiences,
        )
