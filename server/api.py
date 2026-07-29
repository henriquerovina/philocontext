import asyncio
import os
import traceback
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from orchestrator import PhilosophyAnalyzer
from agents.debate_agent import DebateAgent
from models import IdentifyPaperRequest, AnalyzeCandidateRequest, DebateQuestionsRequest, EvaluateAnswerRequest, DebateQuestion

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = PhilosophyAnalyzer()
debate_agent = DebateAgent()


ALLOWED_EXTENSIONS = (".pdf", ".png", ".jpg", ".jpeg", ".webp")


@app.post("/api/analyze")
async def analyze_pdf(file: UploadFile = File(...)):
    filename_lower = file.filename.lower() if file.filename else ""
    if not filename_lower.endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(status_code=400, detail="Only PDF and image files (.pdf, .png, .jpg, .jpeg, .webp) allowed")

    temp_path = f"temp_{file.filename.replace(' ', '_')}"

    try:
        content = await file.read()
        with open(temp_path, "wb") as buffer:
            buffer.write(content)

        result = await analyzer.analyze_paper(temp_path)
        return result.model_dump()

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@app.post("/api/identify-paper")
async def identify_paper(req: IdentifyPaperRequest):
    try:
        if not req.description.strip():
            return JSONResponse(
                status_code=400,
                content={"error": "Please provide a description of the paper."}
            )
        res = await analyzer.identify_paper(req.description)
        return res
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/analyze-identified")
async def analyze_identified(req: AnalyzeCandidateRequest):
    try:
        packet = await analyzer.analyze_identified_paper(req.author, req.work, req.period)
        return packet.model_dump()
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@app.post("/api/debate/questions")
async def debate_questions(req: DebateQuestionsRequest):
    try:
        result = await asyncio.to_thread(
            debate_agent.generate_questions,
            req.metadata,
            req.raw_text,
            req.study_guide_concepts,
            req.count,
        )
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/api/debate/evaluate")
async def debate_evaluate(req: EvaluateAnswerRequest):
    try:
        result = await asyncio.to_thread(
            debate_agent.evaluate_answer,
            req.question.model_dump(),
            req.user_answer,
            req.metadata,
        )
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/api/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
