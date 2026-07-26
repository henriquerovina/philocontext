from abc import ABC, abstractmethod
from groq import Groq
from config import GROQ_API_KEY, MODEL


class BaseAgent(ABC):
    def __init__(self, temperature: float = 0.3):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = MODEL
        self.temperature = temperature

    def call_llm(self, system_prompt: str, user_prompt: str, json_mode: bool = False) -> str:
        try:
            kwargs = {}
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                model=self.model,
                temperature=self.temperature,
                **kwargs
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f"Agent Error: {str(e)}"

    @abstractmethod
    def process(self, *args, **kwargs):
        pass
