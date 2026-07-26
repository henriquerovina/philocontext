# Philocontext Backend

Upload a philosophy PDF → get rich context (metadata, historical background, study guide).

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file (gitignored):

```
GROQ_API_KEY=your_actual_api_key_here
```

## Run

API server (used by the frontend):

```bash
uvicorn api:app --reload
# → http://localhost:8000
# POST /api/analyze  (multipart form, field "file" = PDF, max 50 pages)
# GET  /api/health
```

CLI test (no server):

```bash
python main.py path/to/paper.pdf
```

## Structure

- `config.py` — env, model, temps, prompt templates
- `models.py` — Pydantic schemas (`ResearchPacket` = API response)
- `extractors/pdf_extractor.py` — `PhiloParser` (PDF → text)
- `agents/` — `MetadataAgent`, `HistoryAgent`, `ExamAgent` (all extend `BaseAgent`)
- `orchestrator.py` — `PhilosophyAnalyzer`: extract → metadata → history + exam in parallel
- `api.py` — FastAPI app

## Deploy (Railway)

1. Connect repo, set root to `PythonProject/`
2. Set `GROQ_API_KEY` env var
3. Start command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
