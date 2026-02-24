import re
from typing import List, Dict

SAFETY_KEYWORDS = [
    "call 911",
    "emergency",
    "suicid",
    "overdos",
    "self-harm",
    "harm themselves",
    "unconscious",
    "not breathing",
]

SAFETY_REDIRECT = (
    "This situation may require immediate medical attention. "
    "Please call 911 or your local emergency services right away, "
    "or contact the Alzheimer's Association 24/7 Helpline at 1-800-272-3900."
)


class RefinementService:
    def refine(self, raw_answer: str, rag_context: List[Dict]) -> str:
        if self._is_emergency(raw_answer):
            return SAFETY_REDIRECT

        answer = self._remove_prompt_leakage(raw_answer)
        answer = self._normalize_whitespace(answer)
        answer = self._ensure_empathetic_closing(answer)
        return answer

    def _is_emergency(self, text: str) -> bool:
        lowered = text.lower()
        return any(keyword in lowered for keyword in SAFETY_KEYWORDS)

    def _remove_prompt_leakage(self, text: str) -> str:
        markers = ["<|system|>", "<|context|>", "<|history|>", "<|user|>", "<|assistant|>"]
        for marker in markers:
            text = text.replace(marker, "")
        return text.strip()

    def _normalize_whitespace(self, text: str) -> str:
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def _ensure_empathetic_closing(self, text: str) -> str:
        closing_phrases = [
            "you're doing a great job",
            "caregiving is challenging",
            "you are not alone",
            "reach out for support",
            "helpline",
        ]
        lowered = text.lower()
        has_closing = any(phrase in lowered for phrase in closing_phrases)

        if not has_closing:
            text += (
                "\n\nRemember, caregiving can be overwhelming — you are not alone. "
                "The Alzheimer's Association Helpline (1-800-272-3900) is available 24/7."
            )
        return text
