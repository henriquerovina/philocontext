from agents.base_agent import BaseAgent
from config import HISTORY_PROMPT_TEMPLATE, HISTORY_CONTEXT_TEMP


class HistoryAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=HISTORY_CONTEXT_TEMP)

    def process(self, metadata: dict) -> str:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        location = metadata.get("location", "Unknown")
        period = metadata.get("period", "Unknown")

        prompt = HISTORY_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            period=period,
            location=location
        )
        return self.call_llm(
            system_prompt="You are a historian specializing in intellectual and political history.",
            user_prompt=prompt
        )
