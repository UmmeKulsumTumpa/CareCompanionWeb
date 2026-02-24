import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import time

BASE_URL = "https://www.alz.org"

SEED_URLS = [
    "/alzheimers-dementia/what-is-alzheimers",
    "/alzheimers-dementia/what-is-dementia",
    "/alzheimers-dementia/stages",
    "/alzheimers-dementia/treatments",
    "/help-support/caregiving",
    "/help-support/caregiving/daily-care",
    "/help-support/caregiving/financial-legal-planning",
    "/help-support/caregiving/safety",
    "/help-support/caregiving/communication-and-alzheimers",
    "/help-support/caregiving/care-options",
    "/help-support/caregiving/caregiver-health",
]

HEADERS = {"User-Agent": "Mozilla/5.0 (research-bot/1.0; educational use)"}


def scrape_page(url: str) -> Dict:
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["nav", "footer", "header", "script", "style", "aside", "form"]):
            tag.decompose()

        main = soup.find("main") or soup.find("div", class_="content-area") or soup.body
        text = main.get_text(separator="\n") if main else soup.get_text(separator="\n")

        return {
            "text": text,
            "url": url,
            "source": "Alzheimer's Association",
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
