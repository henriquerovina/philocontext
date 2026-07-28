import json
from agents.base_agent import BaseAgent
from config import EXAM_PROMPT_TEMPLATE, EXAM_GUIDE_TEMP


class ExamAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=EXAM_GUIDE_TEMP)

    def process(self, metadata: dict, raw_text: str = "") -> dict:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        concepts_list = metadata.get("core_concepts", [])
        concepts = ", ".join(concepts_list) if concepts_list else "core philosophical concepts"

        excerpt = raw_text[:5000] if raw_text else "No source text available."

        prompt = EXAM_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            concepts=concepts,
            text=excerpt
        )
        result = self.call_llm(
            system_prompt="You are a helpful Philosophy Professor. Return only valid JSON.",
            user_prompt=prompt,
            json_mode=True
        )
        try:
            parsed = json.loads(result)
            if "concepts" not in parsed or not isinstance(parsed["concepts"], list):
                raise ValueError("Missing concepts")
            return parsed
        except (json.JSONDecodeError, TypeError, ValueError):
            clean = result if not result.startswith("Agent Error") else ""
            if clean:
                # Try to at least provide something useful
                first_concept = concepts_list[0] if concepts_list else "Unknown"
                return {
                    "concepts": [
                        {
                            "concept": first_concept,
                            "definition": clean,
                            "stakes": "",
                            "exam_trap": "",
                            "source_quotes": []
                        }
                    ]
                }
            return {"concepts": []}
