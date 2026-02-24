from pydantic import BaseModel
from typing import List, Optional


class ChatTurn(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    query: str
    chat_history: Optional[List[ChatTurn]] = []
    include_related_experiences: Optional[bool] = True


class SourceReference(BaseModel):
    name: str
    url: str


class RelatedExperience(BaseModel):
    text: str
    source: str
    url: str
    similarity_score: float


class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceReference]
    related_experiences: Optional[List[RelatedExperience]] = []
