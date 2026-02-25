import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import time

BASE_URL = "https://www.caregiver.org"

# Family Caregiver Alliance — plain-language practical fact sheets
# Vocabulary closely matches how caregivers actually ask questions
SEED_URLS = [
    "/resource/bathing-grooming-in-home-caregiving/",
    "/resource/incontinence-home-care-strategies/",
    "/resource/wandering/",
    "/resource/sundowning/",
    "/resource/caregiver-depression-a-silent-health-crisis/",
    "/resource/taking-care-of-you-self-care-for-family-caregivers/",
    "/resource/caregiver-burnout/",
    "/resource/eating-and-nutrition-issues-for-adults-with-dementia/",
    "/resource/sleep-dementia/",
    "/resource/falls-reducing-risk-for-older-adults/",
    "/resource/medication-management/",
    "/resource/agitation-and-aggression/",
    "/resource/dementia-planning-for-the-later-stages/",
    "/resource/driving-when-you-have-dementia/",
    "/resource/dementia-definitions/",
    "/resource/alzheimers-disease/",
    "/resource/vascular-dementia/",
    "/resource/lewy-body-dementia/",
    "/resource/home-safety-and-alzheimers-disease/",
    "/resource/pain-assessment-and-management/",
    "/resource/grief-and-loss-when-you-are-a-caregiver/",
    "/resource/communicating-with-someone-who-has-memory-loss/",
    "/resource/late-stage-caregiving/",
    "/resource/urinary-tract-infections-and-dementia/",
    "/resource/managing-challenging-behaviors/",
]

HEADERS = {"User-Agent": "Mozilla/5.0 (research-bot/1.0; educational use)"}


def scrape_page(url: str) -> Dict:
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["nav", "footer", "header", "script", "style", "aside", "form"]):
            tag.decompose()

        main = (
            soup.find("article")
            or soup.find("div", class_="entry-content")
            or soup.find("div", class_="content")
            or soup.find("main")
            or soup.body
        )
        text = main.get_text(separator="\n") if main else soup.get_text(separator="\n")

        return {
            "text": text,
            "url": url,
            "source": "Family Caregiver Alliance",
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
