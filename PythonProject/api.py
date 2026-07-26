import os
from fastapi import FastAPI, UploadFile, File, HTTPException, Form  # Added Form here
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from main import PhiloParser, get_historical_context, generate_exam_review

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/view-pdf/{filename}")
async def view_pdf(filename: str):
    file_path = f"temp_{filename}"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="PDF not found.")


@app.post("/analyze-philosophy")
async def analyze_pdf(file: UploadFile = File(...), section: str = Form("Whole Book")):
    safe_name = file.filename.replace(" ", "_")
    temp_path = f"temp_{safe_name}"

    try:
        content = await file.read()
        with open(temp_path, "wb") as buffer:
            buffer.write(content)

        parser = PhiloParser(temp_path)

        # Logic: Extract based on selection
        if section == "Whole Book":
            # If your extract_text method doesn't support max_pages=200 yet,
            # ensure it's updated in main.py
            raw_text = parser.extract_text(max_pages=200)
        else:
            # Ensure extract_specific_section is defined in your PhiloParser class in main.py
            raw_text = parser.extract_specific_section(section)

        metadata = parser.get_contextual_metadata(raw_text)

        # Force dictionary check to prevent '.get' errors
        if not isinstance(metadata, dict):
            metadata = {"author": str(metadata), "work": safe_name}

        history = get_historical_context(metadata)
        exam_guide = generate_exam_review(metadata)

        return {
            "metadata": {**metadata, "filename": safe_name, "active_section": section},
            "historical_context": str(history),
            "exam_study_guide": str(exam_guide),
        }
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)