import json
from agents.base_agent import BaseAgent
from config import IDENTIFY_PROMPT_TEMPLATE, SYNTHETIC_TEXT_PROMPT_TEMPLATE


class IdentifyAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=0.1)

    def process(self, description: str) -> dict:
        prompt = IDENTIFY_PROMPT_TEMPLATE.format(description=description)
        response = self.call_llm(
            system_prompt="You are a philosophy librarian expert that outputs strictly JSON.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            data = json.loads(response)
            if isinstance(data, dict) and "candidates" in data:
                return data
            return {"candidates": []}
        except (json.JSONDecodeError, TypeError):
            return {"candidates": []}

    def generate_synthetic_text(self, author: str, work: str, period: str) -> str:
        prompt = SYNTHETIC_TEXT_PROMPT_TEMPLATE.format(work=work, author=author, period=period)
        response = self.call_llm(
            system_prompt="You are an expert philosophy professor and scholarly writer.",
            user_prompt=prompt,
            json_mode=False
        )
        if response.startswith("Agent Error"):
            return f"Error generating text for {work} by {author}"
        return response
