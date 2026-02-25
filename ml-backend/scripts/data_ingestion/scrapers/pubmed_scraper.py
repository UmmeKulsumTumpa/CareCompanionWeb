import requests
import time
from typing import List, Dict
from xml.etree import ElementTree

ENTREZ_SEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
ENTREZ_FETCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

SEARCH_QUERIES = [
    "Alzheimer disease caregiver communication",
    "Alzheimer disease caregiver daily care strategies",
    "dementia caregiver stress management",
    "Alzheimer disease behavioral symptoms management",
    "dementia caregiver burden intervention",
    "Alzheimer disease caregiver safety home",
    "dementia care nutrition feeding",
    "Alzheimer disease caregiver sleep problems",
    "dementia bathing refusal resistiveness to care",
    "dementia incontinence management caregiver",
    "dementia wandering prevention safety",
    "dementia sundowning evening agitation management",
    "Alzheimer disease fall prevention older adults",
    "dementia medication management caregiver",
    "dementia aggression anger nonpharmacological intervention",
    "dementia caregiver burnout self-care",
    "Alzheimer disease stage 5 late stage care",
    "dementia diabetes comorbidity management",
    "dementia congestive heart failure comorbidity",
    "dementia caregiver communication refusal care",
    "dementia personal hygiene care strategies",
    "dementia depression anxiety caregiver support",
    "Alzheimer disease hallucinations delusions management",
    "dementia pain assessment nonverbal",
    "dementia repetitive behavior management",
]

EMAIL = "research@caregiver-bot.com"


def search_pubmed(query: str, max_results: int = 20) -> List[str]:
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "retmode": "json",
        "email": EMAIL,
    }
    response = requests.get(ENTREZ_SEARCH_URL, params=params, timeout=15)
    response.raise_for_status()
    return response.json()["esearchresult"]["idlist"]


def fetch_abstracts(pmids: List[str]) -> List[Dict]:
    if not pmids:
        return []

    all_results = []
    # Fetch in batches of 20 to avoid 400 errors from oversized requests
    batch_size = 20
    for i in range(0, len(pmids), batch_size):
        batch = pmids[i:i + batch_size]
        params = {
            "db": "pubmed",
            "id": ",".join(batch),
            "rettype": "abstract",
            "retmode": "xml",
            "email": EMAIL,
        }
        try:
            response = requests.get(ENTREZ_FETCH_URL, params=params, timeout=30)
            response.raise_for_status()
        except Exception:
            continue

        root = ElementTree.fromstring(response.content)

        for article in root.findall(".//PubmedArticle"):
            try:
                pmid_el = article.find(".//PMID")
                title_el = article.find(".//ArticleTitle")
                abstract_el = article.find(".//AbstractText")

                if abstract_el is None or not abstract_el.text:
                    continue

                pmid = pmid_el.text if pmid_el is not None else ""
                title = title_el.text if title_el is not None else ""
                abstract = abstract_el.text

                all_results.append(
                    {
                        "text": f"{title}\n\n{abstract}",
                        "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                        "source": "PubMed / NIH",
                    }
                )
            except Exception:
                continue
        time.sleep(0.4)

    return all_results


def scrape_all() -> List[Dict]:
    all_results = []
    seen_urls = set()

    for query in SEARCH_QUERIES:
        pmids = search_pubmed(query)
        abstracts = fetch_abstracts(pmids)
        for item in abstracts:
            if item["url"] not in seen_urls:
                seen_urls.add(item["url"])
                all_results.append(item)
        time.sleep(0.5)

    return all_results
