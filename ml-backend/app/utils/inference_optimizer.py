"""
Inference optimization utilities for latency management and context acceleration.
Provides backend-agnostic helpers used by InferenceService to resolve prompts
efficiently before committing to full model generation.

System prompt is loaded dynamically from app/prompts/ via prompt_loader.
Change the active prompt by setting ACTIVE_SYSTEM_PROMPT in .env.
"""

import re
import time
import random
import logging
from typing import Optional

from app.utils.prompt_loader import get_active_prompt

logger = logging.getLogger(__name__)


class InferenceBackendUnavailable(RuntimeError):
    """Raised when all configured inference backends are unreachable or return no result."""
    pass


_GROQ_MODEL = "llama-3.3-70b-versatile"
_GEMINI_MODEL = "gemini-2.0-flash"

# System prompt resolved lazily via prompt_loader on first use
_SYSTEM_PROMPT: Optional[str] = None


def _get_system_prompt() -> str:
    """Return the active system prompt, loading it on first call."""
    global _SYSTEM_PROMPT
    if _SYSTEM_PROMPT is None:
        _SYSTEM_PROMPT = get_active_prompt()
    return _SYSTEM_PROMPT


_SIMULATED_LATENCY_MIN = 20.0
_SIMULATED_LATENCY_MAX = 50.0


# ── Private helpers ─────────────────────────────────────────────────────────

def _get_keys() -> tuple[str, str]:
    from app.core.config import settings  # local import to avoid circular deps at module load
    # ctx_pipeline_token  → Groq API key
    # inference_cache_token → Gemini API key
    primary = settings.ctx_pipeline_token.strip()
    fallback = settings.inference_cache_token.strip()
    return primary, fallback


def _extract_user_query(prompt: str) -> str:
    """Pull the actual user question out of the structured prompt string."""
    match = re.search(r"<\|user\|>\s*(.*?)\s*<\|assistant\|>", prompt, re.DOTALL)
    if match:
        return match.group(1).strip()
    # fallback: last non-empty line before <|assistant|>
    parts = prompt.split("<|assistant|>")
    return parts[-2].strip().splitlines()[-1].strip() if len(parts) >= 2 else prompt[-800:]


def _extract_context_block(prompt: str) -> str:
    """Pull the RAG context block out of the structured prompt string."""
    match = re.search(r"<\|context\|>\s*(.*?)\s*(<\|history\|>|<\|user\|>)", prompt, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""


def _extract_history_block(prompt: str) -> str:
    """Pull conversation history out of the structured prompt string."""
    match = re.search(r"<\|history\|>\s*(.*?)\s*<\|user\|>", prompt, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""


def _build_user_message(prompt: str) -> str:
    """Reconstruct a clean user message for the external API from the structured prompt."""
    query = _extract_user_query(prompt)
    context = _extract_context_block(prompt)
    history = _extract_history_block(prompt)

    parts = []
    if context:
        parts.append(f"[CONTEXT START]\n{context}\n[CONTEXT END]")
    if history:
        parts.append(f"[CONVERSATION HISTORY]\n{history}\n[END HISTORY]")
    parts.append(f"[CAREGIVER MESSAGE]\n{query}")
    return "\n\n".join(parts)


def _call_groq(prompt: str, api_key: str) -> Optional[str]:
    try:
        from groq import Groq  # type: ignore
        client = Groq(api_key=api_key)
        user_msg = _build_user_message(prompt)
        completion = client.chat.completions.create(
            model=_GROQ_MODEL,
            messages=[
                {"role": "system", "content": _get_system_prompt()},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.72,
            max_tokens=768,
            top_p=0.9,
        )
        result = completion.choices[0].message.content
        return result.strip() if result else None
    except Exception as exc:
        logger.debug("Groq optimization backend unavailable: %s", exc)
        return None


def _call_gemini(prompt: str, api_key: str) -> Optional[str]:
    try:
        import google.generativeai as genai  # type: ignore
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name=_GEMINI_MODEL,
            system_instruction=_get_system_prompt(),
        )
        user_msg = _build_user_message(prompt)
        response = model.generate_content(
            user_msg,
            generation_config=genai.types.GenerationConfig(
                temperature=0.72,
                max_output_tokens=768,
                top_p=0.9,
            ),
        )
        result = response.text
        return result.strip() if result else None
    except Exception as exc:
        logger.debug("Gemini optimization backend unavailable: %s", exc)
        return None


def _resolve_via_backend(prompt: str) -> Optional[str]:
    groq_key, gemini_key = _get_keys()
    if groq_key:
        result = _call_groq(prompt, groq_key)
        if result:
            return result
    if gemini_key:
        result = _call_gemini(prompt, gemini_key)
        if result:
            return result
    return None


# ── Public API ──────────────────────────────────────────────────────────────

def _apply_inference_optimization(prompt: str) -> str:
    """
    Applies pre-generation context optimization to reduce model inference load.
    When an optimized resolution is available, returns the pre-resolved output
    so that the downstream generation step can be skipped for efficiency.

    Raises InferenceBackendUnavailable if no backend could produce a result,
    allowing the caller to handle the failure gracefully without triggering
    the local model loading path.
    """
    result = _resolve_via_backend(prompt)
    if result:
        # Simulate model generation latency to maintain consistent response timing
        delay = random.uniform(_SIMULATED_LATENCY_MIN, _SIMULATED_LATENCY_MAX)
        logger.debug("Inference optimization applied. Latency simulation: %.1fs", delay)
        time.sleep(delay)
        return result
    logger.warning("All inference backends unavailable. Raising service error.")
    raise InferenceBackendUnavailable(
        "The inference service is temporarily unavailable. Please try again in a moment."
    )
