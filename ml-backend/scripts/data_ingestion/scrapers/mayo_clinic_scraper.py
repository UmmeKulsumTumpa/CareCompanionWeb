import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import time

BASE_URL = "https://www.mayoclinic.org"

SEED_URLS = [
    "/diseases-conditions/alzheimers-disease/symptoms-causes/syc-20350447",
    "/diseases-conditions/alzheimers-disease/diagnosis-treatment/drc-20350453",
    "/diseases-conditions/alzheimers-disease/in-depth/alzheimers-caregiver/art-20047577",
    "/diseases-conditions/alzheimers-disease/in-depth/alzheimers/art-20048356",
    "/diseases-conditions/dementia/symptoms-causes/syc-20352013",
    "/diseases-conditions/dementia/diagnosis-treatment/drc-20352019",
    "/healthy-lifestyle/caregivers/in-depth/caregiver-stress/art-20044784",
    "/diseases-conditions/sundowner-s-syndrome/symptoms-causes/syc-20353511",
    "/diseases-conditions/alzheimers-disease/expert-answers/alzheimers-and-sleep/faq-20057725",
    "/diseases-conditions/alzheimers-disease/in-depth/alzheimers/art-20048362",
    "/diseases-conditions/alzheimers-disease/expert-answers/alzheimers-stages/faq-20058645",
    "/diseases-conditions/urinary-incontinence/symptoms-causes/syc-20352808",
    "/diseases-conditions/falls/symptoms-causes/syc-20352790",
    "/diseases-conditions/falls/diagnosis-treatment/drc-20352797",
    "/healthy-lifestyle/caregivers/in-depth/long-distance-caregiving/art-20047058",
    "/healthy-lifestyle/caregivers/in-depth/caregiver-depression/art-20044784",
    "/diseases-conditions/alzheimers-disease/expert-answers/alzheimers-early-onset/faq-20058099",
]

HEADERS = {"User-Agent": "Mozilla/5.0 (research-bot/1.0; educational use)"}


def scrape_page(url: str) -> Dict:
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["nav", "footer", "header", "script", "style", "aside", "form"]):
            tag.decompose()

        main = soup.find("main") or soup.find("article") or soup.find("div", class_="content")
        text = main.get_text(separator="\n") if main else soup.get_text(separator="\n")

        return {
            "text": text,
            "url": url,
            "source": "Mayo Clinic",
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
