import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"
MAX_PDF_PAGES = 50

METADATA_EXTRACTION_TEMP = 0.1
HISTORY_CONTEXT_TEMP = 0.4
EXAM_GUIDE_TEMP = 0.3
ARGUMENT_ANALYSIS_TEMP = 0.2

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

Below is an excerpt from the text to ground your analysis in the author's actual writing:

---BEGIN EXCERPT---
{text}
---END EXCERPT---

Return ONLY valid JSON with this structure:
{{
  "sections": [
    {{
      "title": "Political & Social Context",
      "content": "concise analysis with specific examples",
      "source_quotes": ["relevant quote from excerpt above"]
    }},
    {{
      "title": "Intellectual Debates",
      "content": "what problems or debates the author was responding to",
      "source_quotes": ["relevant quote"]
    }},
    {{
      "title": "Significance",
      "content": "why this work was revolutionary, controversial, or significant",
      "source_quotes": ["relevant quote"]
    }},
    {{
      "title": "Key Historical Events",
      "content": "events that shaped the author's thinking",
      "source_quotes": ["relevant quote"]
    }}
  ],
  "timeline": [
    {{ "date": "Year", "event": "Description" }}
  ]
}}

Be concise, cite specific passages from the excerpt, and explain why this context matters for understanding the work.
If no relevant quote exists for a section, use an empty array for source_quotes.
"""

EXAM_PROMPT_TEMPLATE = """
You are a Philosophy Professor preparing students for exams.

Based on {work} by {author}, create a study guide for these core concepts:
{concepts}

Below is an excerpt from the text to ground your explanations:

---BEGIN EXCERPT---
{text}
---END EXCERPT---

Return ONLY valid JSON with this structure:
{{
  "concepts": [
    {{
      "concept": "Concept Name",
      "definition": "One clear sentence defining this concept as it appears in {work}",
      "stakes": "Why this matters philosophically — what problem does it solve?",
      "exam_trap": "What do students commonly misunderstand?",
      "source_quotes": ["direct quote from excerpt supporting this concept"]
    }}
  ]
}}

Make each concept accessible to undergraduates studying for a midterm.
Ensure every concept includes at least one source quote from the excerpt when possible.
If no relevant quote exists, use an empty array.
"""

ARGUMENT_PROMPT_TEMPLATE = """
Extract the central argument from this philosophical text and return ONLY a valid JSON object with the following structure:

{{
  "thesis": {{
    "original": "exact thesis statement from text",
    "simplified": "plain English simplification",
    "logical_form": "formal logical notation"
  }},
  "premises": [
    {{ "original": "exact premise from text", "simplified": "plain English" }}
  ],
  "conclusion": {{
    "original": "exact conclusion from text",
    "simplified": "plain English"
  }},
  "reconstructions": [
    {{
      "type": "modus_ponens|modus_tollens|syllogism|contrapositive|de_morgan|etc",
      "formal": "P → Q, P ⊢ Q",
      "plain": "If P then Q; P is true, so Q follows"
    }}
  ],
  "fallacies": [
    {{
      "name": "affirming_the_consequent|strawman|ad_hominem|etc",
      "description": "explanation of the fallacy",
      "found_in_text": "quoted passage where fallacy occurs"
    }}
  ],
  "objections": [
    {{
      "critic": "Name of critic",
      "summary": "summary of objection",
      "era": "contemporary|later",
      "popularity": "major|niche",
      "response": "possible response to objection"
    }}
  ]
}}

If no fallacies are present, return an empty array for fallacies.
Be precise and grounded in the provided text.

Text: {text}
"""

DEBATE_TEMP = 0.4
DEBATE_QUESTION_PROMPT_TEMPLATE = """
You are a Socratic philosophy professor preparing an oral exam on "{work}" by {author} ({period}).

The student has already studied these concepts:
{concepts}

Below is an excerpt from the text:
---BEGIN EXCERPT---
{text}
---END EXCERPT---

Generate {count} questions that probe whether the student truly understands the author's reasoning, not just memorized definitions.
Mix question types:
- "Explain the author's thesis in your own words" (thesis comprehension)
- "Why does the author believe X?" (premise reasoning)
- "How would the author respond to objection Y?" (counterargument anticipation)
- "What distinguishes concept A from concept B?" (fine-grained distinction)

Return ONLY valid JSON:
{{
  "questions": [
    {{
      "question": "The question to ask the student",
      "concept_tested": "Which concept this probes",
      "expected_key_points": ["point 1", "point 2", "point 3"],
      "hints": ["hint if student struggles"]
    }}
  ]
}}
"""

DEBATE_EVALUATE_PROMPT_TEMPLATE = """
You are a philosophy professor evaluating a student's oral exam answer about "{work}" by {author}.

Question: {question}
Concept being tested: {concept_tested}
Expected key points: {expected_key_points}

Student's answer: "{user_answer}"

Evaluate the answer:
1. Score 1–5 (1 = completely wrong/missing, 5 = excellent grasp)
2. What the student got right
3. What key points are missing or misunderstood
4. What they should re-study

Return ONLY valid JSON:
{{
  "score": 1 to 5,
  "correct_points": ["what they got right"],
  "missing_points": ["what's missing"],
  "feedback": "2-3 sentence constructive feedback",
  "suggested_study": "specific concept or passage to re-read"
}}
"""

IDENTIFY_PROMPT_TEMPLATE = """
You are an expert philosophy librarian. A student is looking for a reading or philosophy paper based on their description, but they don't have the text.

Analyze the description and provide up to 3 most likely matching philosophical works, essays, or books. Order them by confidence (highest first).

Return ONLY a valid JSON object with this exact structure:
{{
  "candidates": [
    {{
      "author": "Author name",
      "work": "Work title",
      "period": "Era/century/year",
      "confidence": 1 to 10 integer,
      "reasoning": "brief explanation of why this matches the description"
    }}
  ]
}}

If the description is completely unrecognizable, return an empty candidates array: {{ "candidates": [] }}.

Description: {description}
"""

SYNTHETIC_TEXT_PROMPT_TEMPLATE = """
You are a philosophy expert. Generate a comprehensive scholarly excerpt and summary representing "{work}" by {author} ({period}).

The text should be detailed (at least 1500 words) and structured so that it clearly contains:
1. The core thesis and main philosophical arguments
2. Key conceptual definitions and distinctions made by the author
3. Direct formulations of the premises and conclusions
4. Representative quotations or passages characteristic of the work

Write this as a continuous philosophical prose passage that can be analyzed for arguments, historical context, and exam study guides.
"""
