from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
from typing import List, Dict


class InferenceService:
    def __init__(
        self,
        model_name: str,
        hf_token: str,
        max_new_tokens: int,
        temperature: float,
        top_p: float,
    ):
        self._max_new_tokens = max_new_tokens
        self._temperature = temperature
        self._top_p = top_p

        self._tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            token=hf_token if hf_token else None,
            trust_remote_code=True,
        )
        self._model = AutoModelForCausalLM.from_pretrained(
            model_name,
            token=hf_token if hf_token else None,
            torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
            device_map="auto" if torch.cuda.is_available() else None,
            trust_remote_code=True,
        )
        self._model.eval()

    def generate(self, prompt: str) -> str:
        inputs = self._tokenizer(prompt, return_tensors="pt")
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}

        with torch.no_grad():
            output_ids = self._model.generate(
                **inputs,
                max_new_tokens=self._max_new_tokens,
                temperature=self._temperature,
                top_p=self._top_p,
                do_sample=True,
                pad_token_id=self._tokenizer.eos_token_id,
            )

        input_len = inputs["input_ids"].shape[1]
        generated_ids = output_ids[0][input_len:]
        return self._tokenizer.decode(generated_ids, skip_special_tokens=True).strip()

    def build_prompt(
        self,
        query: str,
        rag_context: List[Dict],
        chat_history: List[Dict],
    ) -> str:
        system = (
            "You are a compassionate and knowledgeable assistant for Alzheimer's and dementia caregivers. "
            "Base your answers strictly on the provided medical context from authoritative sources. "
            "Do not speculate beyond the provided context. "
            "Always respond with empathy, clarity, and evidence-based information."
        )

        context_block = ""
        if rag_context:
            context_parts = []
            for chunk in rag_context:
                context_parts.append(
                    f"[Source: {chunk['source']} | {chunk['url']}]\n{chunk['text']}"
                )
            context_block = "\n\n".join(context_parts)

        history_block = ""
        if chat_history:
            turns = []
            for turn in chat_history:
                role_label = "User" if turn["role"] == "user" else "Assistant"
                turns.append(f"{role_label}: {turn['content']}")
            history_block = "\n".join(turns)

        prompt_parts = [f"<|system|>\n{system}"]
        if context_block:
            prompt_parts.append(f"<|context|>\n{context_block}")
        if history_block:
            prompt_parts.append(f"<|history|>\n{history_block}")
        prompt_parts.append(f"<|user|>\n{query}")
        prompt_parts.append("<|assistant|>")

        return "\n\n".join(prompt_parts)
