import json
from groq import Groq

# Same setup as before
GROQ_API_KEY = "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"
client = Groq(api_key=GROQ_API_KEY)


def get_historical_context(metadata: dict) -> str:
    """Uses Groq to fetch the specific historical atmosphere of the text."""

    # Destructure the metadata for the prompt
    author = metadata.get("author")
    work = metadata.get("work")
    location = metadata.get("location")
    period = metadata.get("period")

    prompt = f"""
    A student is reading '{work}' by {author} ({period}) in {location}.
    Provide a professional summary of the historical context including:
    1. The specific Political Conflict happening then (e.g., Glorious Revolution).
    2. The Social Criticism the author was responding to (e.g., Divine Right of Kings).
    3. Why this specific environment made this text revolutionary.
    """

    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a political historian."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.5
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Historical Analysis Error: {str(e)}"


# --- Quick Test ---
if __name__ == "__main__":
    # This is the data we just got from your main.py!
    sample_data = {
        "author": "John Locke",
        "work": "Two Treatises of Government",
        "period": "17th century",
        "location": "England"
    }

    print("[*] Generating Historical Context for John Locke...")
    analysis = get_historical_context(sample_data)
    print("\n--- HISTORICAL ANALYSIS ---")
    print(analysis)