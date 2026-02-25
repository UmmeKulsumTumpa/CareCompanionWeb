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
    "/health/alzheimers-caregiving-providing-personal-care",
    "/health/alzheimers-caregiving-bathing",
    "/health/alzheimers-caregiving-dressing",
    "/health/alzheimers-caregiving-eating",
    "/health/alzheimers-caregiving-home-safety",
    "/health/alzheimers-caregiving-medicines",
    "/health/alzheimers-caregiving-incontinence",
    "/health/alzheimers-caregiving-sleep-problems-and-sundowning",
    "/health/alzheimers-caregiving-wandering",
    "/health/alzheimers-caregiving-depression",
    "/health/alzheimers-caregiving-anxiety-and-agitation",
    "/health/alzheimers-caregiving-hallucinations-and-delusions",
    "/health/alzheimers-caregiving-repetitive-behaviors",
    "/health/alzheimers-caregiving-depression-caregiver",
    "/health/caring-for-yourself-when-you-are-a-caregiver",
    "/health/prevent-falls-and-fractures",
    "/health/urinary-incontinence-in-older-adults",
    "/health/all-about-sleep",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


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
