import re


def clean_html_text(raw_text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", raw_text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    text = re.sub(r"(Skip to|Cookie|Subscribe|Donate|Newsletter|©|All rights reserved).*\n", "", text, flags=re.IGNORECASE)
    text = "\n".join(
        line.strip() for line in text.splitlines() if len(line.strip()) > 30
    )
    return text.strip()
