import json
from agents.base_agent import BaseAgent
from config import DEBATE_TEMP, DEBATE_QUESTION_PROMPT_TEMPLATE, DEBATE_EVALUATE_PROMPT_TEMPLATE


class DebateAgent(BaseAgent):
    def __init__(self):
        super().__init__(temperature=DEBATE_TEMP)

    def process(self, *args, **kwargs):
        raise NotImplementedError("Use generate_questions() or evaluate_answer()")

    def generate_questions(self, metadata: dict, raw_text: str, study_guide_concepts: list, count: int = 6) -> dict:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        period = metadata.get("period", "Unknown")
        concepts = ", ".join([c.get("concept", "") for c in study_guide_concepts]) if study_guide_concepts else "core concepts"
        excerpt = raw_text[:5000] if raw_text else "No source text available."

        prompt = DEBATE_QUESTION_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            period=period,
            concepts=concepts,
            text=excerpt,
            count=count,
        )
        result = self.call_llm(
            system_prompt="You are a Socratic philosophy professor. Return only valid JSON.",
            user_prompt=prompt,
            json_mode=True,
        )
        try:
            parsed = json.loads(result)
            if "questions" not in parsed or not isinstance(parsed["questions"], list):
                raise ValueError("Missing questions")
            return parsed
        except (json.JSONDecodeError, TypeError, ValueError):
            return {"questions": []}

    def evaluate_answer(self, question: dict, user_answer: str, metadata: dict) -> dict:
        author = metadata.get("author", "Unknown")
        work = metadata.get("work", "Unknown")
        expected = ", ".join(question.get("expected_key_points", []))

        prompt = DEBATE_EVALUATE_PROMPT_TEMPLATE.format(
            work=work,
            author=author,
            question=question.get("question", ""),
            concept_tested=question.get("concept_tested", ""),
            expected_key_points=expected,
            user_answer=user_answer,
        )
        result = self.call_llm(
            system_prompt="You are a philosophy professor evaluating a student's answer. Return only valid JSON.",
            user_prompt=prompt,
            json_mode=True,
        )
        try:
            parsed = json.loads(result)
            # Validate required fields
            if "score" not in parsed:
                raise ValueError("Missing score")
            return parsed
        except (json.JSONDecodeError, TypeError, ValueError):
            return {
                "score": 0,
                "correct_points": [],
                "missing_points": ["Evaluation failed"],
                "feedback": "Unable to evaluate the answer.",
                "suggested_study": "",
            }
