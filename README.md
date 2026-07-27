# Philocontext

Upload a philosophy PDF → get rich context (metadata, historical background, study guide).

## Architecture

```
philocontext/
├── client/          # React + Vite frontend (port 5173)
└── server/          # FastAPI backend (port 8000)
```

## Quick Start

**Terminal 1 — Server:**

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Create .env with your GROQ_API_KEY (see server/.env.example)
uvicorn api:app --reload
# → http://localhost:8000
```

**Terminal 2 — Client:**

```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

Open `http://localhost:5173` in your browser.
