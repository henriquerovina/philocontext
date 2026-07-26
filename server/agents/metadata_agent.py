import json
from agents.base_agent import BaseAgent
from config import METADATA_PROMPT_TEMPLATE, METADATA_EXTRACTION_TEMP


class MetadataAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=METADATA_EXTRACTION_TEMP)

    def process(self, raw_text: str) -> dict:
        prompt = METADATA_PROMPT_TEMPLATE.format(text=raw_text[:2000])
        response = self.call_llm(
            system_prompt="You are a philosophy expert that outputs strictly JSON.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            return json.loads(response)
        except (json.JSONDecodeError, TypeError):
            return {"error": "Failed to parse metadata"}
