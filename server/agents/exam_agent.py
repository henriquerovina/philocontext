from agents.base_agent import BaseAgent
from config import EXAM_PROMPT_TEMPLATE, EXAM_GUIDE_TEMP


class ExamAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=EXAM_GUIDE_TEMP)

    def process(self, metadata: dict) -> str:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        concepts = ", ".join(metadata.get("core_concepts", []))

        prompt = EXAM_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            concepts=concepts
        )
        return self.call_llm(
            system_prompt="You are a helpful Philosophy Professor.",
            user_prompt=prompt
        )
