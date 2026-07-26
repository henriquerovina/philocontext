import os
import json
from pypdf import PdfReader
from groq import Groq
from datetime import datetime

# 1. Configuration
GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)


class PhiloParser:
    def extract_specific_section(self, section_title: str) -> str:
        # Load the whole text (or first 50 pages to save memory)
        full_text = self.extract_text(max_pages=50)

        # Basic Logic: Find where the section starts
        # e.g., Find "SECTION I" or "PREFACE"
        start_index = full_text.lower().find(section_title.lower())

        if start_index == -1:
            return full_text[:5000]  # Fallback to beginning if not found

        # Grab roughly 10,000 characters from that starting point
        return full_text[start_index: start_index + 10000]

    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path

    def extract_text(self, max_pages: int = 2) -> str:
        try:
            reader = PdfReader(self.pdf_path)
            content = ""
            for i in range(min(max_pages, len(reader.pages))):
                content += reader.pages[i].extract_text()
            return content
        except Exception as e:
            return f"Error reading PDF: {str(e)}"

    def get_contextual_metadata(self, raw_text: str) -> dict:
        prompt = f"""
        Analyze this philosophical text and return ONLY a valid JSON object.
        JSON Structure:
        {{
            "author": "name",
            "work": "title",
            "period": "year/era",
            "core_concepts": ["list", "of", "concepts"],
            "location": "country/city"
        }}
        Text: {raw_text[:2000]}
        """
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a philosophy expert that outputs strictly JSON."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            return json.loads(chat_completion.choices[0].message.content)
        except Exception as e:
            return {"error": f"Groq extraction failed: {str(e)}"}


# --- AGENT MODULES ---

def get_historical_context(metadata: dict) -> str:
    """Historical context agent."""
    prompt = f"Provide a historical summary for {metadata.get('author')}'s '{metadata.get('work')}' in {metadata.get('location')} during the {metadata.get('period')}. Focus on political conflict and social criticism."
    try:
        completion = client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a political historian."},
                      {"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile"
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"History Error: {str(e)}"


def generate_exam_review(metadata: dict) -> str:
    """Exam review study guide agent."""
    concepts = ", ".join(metadata.get("core_concepts", []))
    prompt = f"Act as a Philosophy Professor. Explain these concepts for an exam on {metadata.get('author')}: {concepts}. Provide a definition, the philosophical stakes, and a common 'Exam Trap'."
    try:
        completion = client.chat.completions.create(
            messages=[{"role": "system", "content": "You are a helpful Philosophy Professor."},
                      {"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Exam Agent Error: {str(e)}"


# --- MAIN EXECUTION ---

if __name__ == "__main__":
    FILE_PATH = "/Users/henriqueoliveira/Documents/Classes/PHL/PHL206/reading.pdf"

    if os.path.exists(FILE_PATH):
        # STEP 1: PARSING
        processor = PhiloParser(FILE_PATH)
        print(f"[*] Extracting text from: {os.path.basename(FILE_PATH)}...")
        raw_text = processor.extract_text()

        metadata = processor.get_contextual_metadata(raw_text)
        print("\n[STEP 1: METADATA]")
        print(json.dumps(metadata, indent=4))

        if "error" not in metadata:
            # STEP 2: HISTORY
            print("\n" + "=" * 50)
            print("[STEP 2: HISTORICAL CONTEXT]")
            print("=" * 50)
            print(get_historical_context(metadata))

            # STEP 3: EXAM REVIEW
            print("\n" + "=" * 50)
            print("[STEP 3: EXAM STUDY GUIDE]")
            print("=" * 50)
            print(generate_exam_review(metadata))
    else:
        print(f"[!] PDF not found at {FILE_PATH}")


def save_research_packet(metadata: dict, history: str, exam: str):
    """Saves the AI agents' output into a structured local directory."""

    # Create a clean folder name from author and work
    author_folder = metadata.get("author", "Unknown").replace(" ", "_")
    work_folder = metadata.get("work", "Untitled").replace(" ", "_")[:30]

    base_path = f"PhiloContext_Library/{author_folder}/{work_folder}"
    os.makedirs(base_path, exist_ok=True)

    # 1. Save the RAW JSON (for the 'Enricher' step)
    with open(f"{base_path}/data.json", "w") as f:
        json.dump(metadata, f, indent=4)

    # 2. Save the Human-Readable Markdown (The 'Context Card')
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    markdown_content = f"""# Research Note: {metadata.get('work')}
**Author:** {metadata.get('author')}
**Era:** {metadata.get('period')} | **Location:** {metadata.get('location')}
**Generated:** {timestamp}

---
## 📜 Historical Context
{history}

---
## 🎓 Exam Study Guide
{exam}
"""

    with open(f"{base_path}/study_guide.md", "w") as f:
        f.write(markdown_content)

    print(f"\n[✔] Research Packet saved to: {base_path}")


def get_contemporaries(metadata: dict) -> str:
    """Finds other influential figures active during the same 20-year window."""
    period = metadata.get("period")
    location = metadata.get("location")

    prompt = f"""
    Context: The year is roughly {period} in {location}.
    Task: Identify 3-4 other influential philosophers or scientists active globally during this 20-year window.
    For each contemporary, provide:
    1. Their Name and Location.
    2. Their 'Opposing or Complementary View' to {metadata.get('author')}.
    3. How their work created a 'clash' of ideas with '{metadata.get('work')}'.
    """

    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a Comparative Historian."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.4
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Contemporaries Error: {str(e)}"