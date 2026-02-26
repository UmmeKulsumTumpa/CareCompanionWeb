"""
System prompt loader for the inference optimizer.

Prompts live as plain-text files under app/prompts/.
Switch the active prompt by changing ACTIVE_SYSTEM_PROMPT in .env
(or app/core/config.py) to the desired filename stem (no .txt extension).

Available prompts
-----------------
  v1_default   – Warm, community-voice tone (original)
  v2_structured – Evidence-based, care-coordinator tone
  v3_concise   – Ultra-short, practical answers

To add a new prompt:
  1. Create  app/prompts/<name>.txt
  2. Set     ACTIVE_SYSTEM_PROMPT=<name>  in .env
  3. Restart the server
"""

from __future__ import annotations

import logging
from functools import lru_cache
from pathlib import Path

logger = logging.getLogger(__name__)

_PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def list_available_prompts() -> list[str]:
    """Return the stems of all .txt files inside app/prompts/."""
    return sorted(p.stem for p in _PROMPTS_DIR.glob("*.txt"))


@lru_cache(maxsize=16)
def load_prompt(name: str) -> str:
    """
    Load and cache the system prompt from app/prompts/<name>.txt.

    Raises FileNotFoundError if the requested prompt file does not exist,
    listing all available options in the error message.
    """
    path = _PROMPTS_DIR / f"{name}.txt"
    if not path.is_file():
        available = ", ".join(list_available_prompts()) or "(none)"
        raise FileNotFoundError(
            f"System prompt '{name}' not found at {path}. "
            f"Available prompts: {available}"
        )
    content = path.read_text(encoding="utf-8").strip()
    logger.info("Loaded system prompt '%s' from %s", name, path)
    return content


def get_active_prompt() -> str:
    """
    Return the system prompt designated by settings.active_system_prompt.
    Falls back to 'v1_default' and logs a warning if the configured prompt
    cannot be found.
    """
    from app.core.config import settings  # local import to avoid circular deps

    name = settings.active_system_prompt.strip()
    try:
        return load_prompt(name)
    except FileNotFoundError as exc:
        logger.warning("%s — falling back to 'v1_default'.", exc)
        return load_prompt("v1_default")
