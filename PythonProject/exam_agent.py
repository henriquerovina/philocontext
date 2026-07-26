clerdef generate_exam_review(metadata: dict) -> str:
    """Creates a high-level study guide based on the parsed philosophy text."""

    concepts = ", ".join(metadata.get("core_concepts", []))

    prompt = f"""
    Act as a Philosophy Professor preparing a student for a Midterm on {metadata.get('author')}.
    Based on the work '{metadata.get('work')}', explain these Core Concepts for an exam:
    {concepts}

    For each concept, provide:
    1. A 1-sentence 'Classroom Definition'.
    2. A 'Why it matters' (the philosophical stakes).
    3. A potential 'Exam Trap' (what students usually get wrong).
    """

    try:
        completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful UW-La Crosse Philosophy Professor."},
                {"role": "user", "content": prompt}
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.3  # Keep it factual and structured
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Study Guide Error: {str(e)}"