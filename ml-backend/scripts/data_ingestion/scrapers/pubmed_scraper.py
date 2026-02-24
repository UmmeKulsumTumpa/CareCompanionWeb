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
]

EMAIL = "research@caregiver-bot.com"


def search_pubmed(query: str, max_results: int = 50) -> List[str]:
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

    params = {
        "db": "pubmed",
        "id": ",".join(pmids),
        "rettype": "abstract",
        "retmode": "xml",
        "email": EMAIL,
    }
    response = requests.get(ENTREZ_FETCH_URL, params=params, timeout=30)
    response.raise_for_status()

    root = ElementTree.fromstring(response.content)
    results = []

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

            results.append(
                {
                    "text": f"{title}\n\n{abstract}",
                    "url": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                    "source": "PubMed / NIH",
                }
            )
        except Exception:
            continue

    return results


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
