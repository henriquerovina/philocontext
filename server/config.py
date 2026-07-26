import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"
MAX_PDF_PAGES = 50

METADATA_EXTRACTION_TEMP = 0.1
HISTORY_CONTEXT_TEMP = 0.4
EXAM_GUIDE_TEMP = 0.3

# Prompt templates
METADATA_PROMPT_TEMPLATE = """
Analyze this philosophical text and return ONLY a valid JSON object.
JSON Structure:
{{
    "author": "name",
    "work": "title",
    "period": "year/era",
    "core_concepts": ["list", "of", "concepts"],
    "location": "country/city"
}}
Text: {text}
"""

HISTORY_PROMPT_TEMPLATE = """
You are a historian specializing in intellectual and political history.

A student is reading "{work}" by {author} ({period}) from {location}.

Provide a professional historical summary that includes:
1. The specific political/social conflicts or movements of the time
2. What intellectual problems or debates the author was responding to
3. How the historical moment made this work revolutionary, controversial, or significant
4. Any relevant historical events that shaped the author's thinking

Be concise, cite specific examples, and explain why this context matters for understanding the work.
"""

EXAM_PROMPT_TEMPLATE = """
You are a Philosophy Professor preparing students for exams.

Based on {work} by {author}, create a study guide for these core concepts:
{concepts}

For EACH concept, provide:
1. Classroom Definition (1 clear sentence)
2. Philosophical Stakes (why it matters, what problem does it solve?)
3. Exam Trap (what do students commonly misunderstand?)

Format clearly with headers. Make it accessible to undergraduates studying for a midterm.
"""
