import json
from agents.base_agent import BaseAgent
from config import ARGUMENT_PROMPT_TEMPLATE, ARGUMENT_ANALYSIS_TEMP


class ArgumentAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=ARGUMENT_ANALYSIS_TEMP)

    def process(self, raw_text: str) -> dict:
        truncated = raw_text[:8000]
        prompt = ARGUMENT_PROMPT_TEMPLATE.format(text=truncated)
        response = self.call_llm(
            system_prompt="You are a philosopher specializing in formal logic and argument reconstruction.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            return json.loads(response)
        except (json.JSONDecodeError, TypeError):
            return {
                "thesis": {"original": "", "simplified": "", "logical_form": ""},
                "premises": [],
                "conclusion": {"original": "", "simplified": ""},
                "reconstructions": [],
                "fallacies": [],
                "objections": []
            }
