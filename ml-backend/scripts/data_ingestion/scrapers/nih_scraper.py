import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import time

BASE_URL = "https://www.nia.nih.gov"

SEED_URLS = [
    "/health/alzheimers-causes-and-risk-factors",
    "/health/what-alzheimers-disease",
    "/health/alzheimers-symptoms-and-diagnosis",
    "/health/how-alzheimers-disease-treated",
    "/health/caring-person-alzheimers-disease",
    "/health/caregiver-guide-alzheimers-disease",
    "/health/getting-help-alzheimers-caregiving",
    "/health/managing-personality-and-behavior-changes-alzheimers",
    "/health/alzheimers-caregiving-changes-communication-skills",
    "/health/what-dementia-symptoms-types-and-diagnosis",
]

HEADERS = {"User-Agent": "Mozilla/5.0 (research-bot/1.0; educational use)"}


def scrape_page(url: str) -> Dict:
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["nav", "footer", "header", "script", "style", "aside", "form"]):
            tag.decompose()

        main = soup.find("main") or soup.find("article") or soup.body
        text = main.get_text(separator="\n") if main else soup.get_text(separator="\n")

        return {
            "text": text,
            "url": url,
            "source": "NIH National Institute on Aging",
        }
    except Exception:
        return None


def scrape_all() -> List[Dict]:
    results = []
    for path in SEED_URLS:
        url = BASE_URL + path
        page = scrape_page(url)
        if page:
            results.append(page)
        time.sleep(1.5)
    return results
