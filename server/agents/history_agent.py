import json
from agents.base_agent import BaseAgent
from config import HISTORY_PROMPT_TEMPLATE, HISTORY_CONTEXT_TEMP


class HistoryAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=HISTORY_CONTEXT_TEMP)

    def process(self, metadata: dict, raw_text: str = "") -> dict:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        location = metadata.get("location", "Unknown")
        period = metadata.get("period", "Unknown")

        excerpt = raw_text[:5000] if raw_text else "No source text available."

        prompt = HISTORY_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            period=period,
            location=location,
            text=excerpt
        )
        result = self.call_llm(
            system_prompt="You are a historian specializing in intellectual and political history. Return only valid JSON.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            parsed = json.loads(result)
            # Ensure required keys exist
            if "sections" not in parsed or not isinstance(parsed["sections"], list):
                raise ValueError("Missing sections")
            return parsed
        except (json.JSONDecodeError, TypeError, ValueError):
            # Fallback: wrap raw result as a single section
            clean = result if not result.startswith("Agent Error") else "Historical context could not be generated."
            return {
                "sections": [
                    {"title": "Historical Overview", "content": clean, "source_quotes": []}
                ]
            }
