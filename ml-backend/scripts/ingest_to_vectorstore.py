import sys
import os
import uuid
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from scripts.data_ingestion.scrapers import (
    mayo_clinic_scraper,
    alz_association_scraper,
    nih_scraper,
    pubmed_scraper,
)
from scripts.data_ingestion.cleaners.html_cleaner import clean_html_text
from scripts.data_ingestion.chunkers.text_chunker import chunk_text
from app.vectorstore.builder import VectorStoreBuilder
from app.core.config import settings


def ingest():
    print("Starting data ingestion...")

    builder = VectorStoreBuilder(
        persist_dir=settings.chroma_persist_dir,
        collection_name=settings.chroma_collection_name,
        embedding_model_name=settings.embedding_model_name,
    )

    scrapers = [
        ("Mayo Clinic", mayo_clinic_scraper),
        ("Alzheimer's Association", alz_association_scraper),
        ("NIH NIA", nih_scraper),
        ("PubMed", pubmed_scraper),
    ]

    today = datetime.utcnow().strftime("%Y-%m-%d")

    for source_name, scraper in scrapers:
        print(f"\nScraping: {source_name}")
        try:
            pages = scraper.scrape_all()
        except Exception as e:
            print(f"  → Scraper failed: {e} — skipping")
            continue
        print(f"  → {len(pages)} pages fetched")

        documents = []
        for page in pages:
            cleaned = clean_html_text(page["text"])
            chunks = chunk_text(cleaned)
            for chunk in chunks:
                documents.append(
                    {
                        "id": str(uuid.uuid4()),
                        "text": chunk,
                        "source": page["source"],
                        "url": page["url"],
                        "topic": "alzheimers_dementia_caregiving",
                        "scraped_at": today,
                    }
                )

        print(f"  → {len(documents)} chunks to index")
        if not documents:
            print(f"  → No documents, skipping.")
            continue
        builder.add_documents(documents)
        print(f"  → Indexed successfully")

    total = builder.get_collection_count()
    print(f"\nIngestion complete. Total vectors in ChromaDB: {total}")


if __name__ == "__main__":
    ingest()
