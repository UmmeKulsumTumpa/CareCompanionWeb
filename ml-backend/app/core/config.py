from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Caregiver Chatbot ML Backend"
    app_version: str = "1.0.0"
    debug: bool = False

    hf_model_name: str = "IAmPilgrim/caregiver-chatbot-qwen25-3b"
    hf_token: str = ""

    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"

    chroma_persist_dir: str = "./chroma_db"
    chroma_collection_name: str = "caregiver_knowledge"

    rag_top_k: int = 5
    rag_similarity_threshold: float = 0.75
    related_experience_threshold: float = 0.80

    chat_history_limit: int = 10

    max_new_tokens: int = 512
    temperature: float = 0.7
    top_p: float = 0.9

    class Config:
        env_file = ".env"


settings = Settings()
