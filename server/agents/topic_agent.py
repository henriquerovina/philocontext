import json
from agents.base_agent import BaseAgent
from config import TOPIC_VIEW_PROMPT_TEMPLATE, TOPIC_VIEW_TEMP


class TopicAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=TOPIC_VIEW_TEMP)

    def process(self, philosopher: str, topic: str) -> dict:
        prompt = TOPIC_VIEW_PROMPT_TEMPLATE.format(philosopher=philosopher, topic=topic)
        response = self.call_llm(
            system_prompt="You are a philosophy professor and historian of ideas who outputs strictly JSON and never fabricates specific names or sources you are not confident about.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            data = json.loads(response)
            return {
                "explanation": data.get("explanation", ""),
                "objections": data.get("objections", []),
                "quotes": data.get("quotes", []),
                "quote_recognition_hint": data.get("quote_recognition_hint", ""),
            }
        except (json.JSONDecodeError, TypeError):
            return {
                "explanation": "",
                "objections": [],
                "quotes": [],
                "quote_recognition_hint": "",
            }
