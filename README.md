# CareCompanion

A full-stack AI-powered companion chat application. Users can register, log in, or continue as a guest and have conversations with an AI model backed by a Retrieval-Augmented Generation (RAG) pipeline. Conversation history is persisted per user.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Ant Design |
| Backend | Node.js, Express, TypeScript, Knex.js |
| ML Backend | Python, FastAPI, LangChain, ChromaDB, HuggingFace |
| Database | PostgreSQL (via Docker) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [Docker](https://www.docker.com/) & Docker Compose

---

## Initial Setup

Run these steps **once** after cloning the repository.

### 1. Database

```bash
docker compose up postgres -d
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env        # edit: DB_PORT=5433, DB_PASSWORD=postgres, set JWT secrets
node_modules/.bin/knex migrate:latest --knexfile knexfile.js
```

### 3. Frontend

```bash
cd frontend
npm install
```

### 4. ML Backend

> **Note:** The first-time setup downloads large model files (~10–15 GB total). Ensure you have sufficient disk space and a stable internet connection.

```bash
cd ml-backend
python3 -m venv venv
venv/bin/pip install -r requirements.txt     # ~5–10 GB
cp .env.example .env                         # set HF_TOKEN=hf_xxx
venv/bin/python scripts/ingest_to_vectorstore.py  # scrape + embed into ChromaDB
```

---

## Running the Application

Open **4 terminal tabs** and run each service:

```bash
# Tab 1 — Database
docker compose up postgres -d

# Tab 2 — Backend  (http://localhost:5001)
cd backend && npm run dev

# Tab 3 — ML Backend  (http://localhost:8000)
cd ml-backend && venv/bin/uvicorn app.main:app --reload --port 8000
# First run downloads the model (~10 GB); cached on subsequent runs.

# Tab 4 — Frontend  (http://localhost:3000)
cd frontend && npm run dev
```

---

## Service Ports

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:5001 |
| ML Backend | http://localhost:8000 |
| ML Backend Docs | http://localhost:8000/docs |
| PostgreSQL | localhost:5433 |

---

## Verification Checklist

After all services are running:

1. http://localhost:3000 — landing page loads
2. Register an account → chat works
3. Send a message → AI responds
4. `/history` — past conversations are visible
5. "Continue as Guest" → chat works without login
6. http://localhost:8000/docs — ML backend Swagger UI loads

---

## Configuration Reference

| File | Key | Description |
|---|---|---|
| `backend/.env` | `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `backend/.env` | `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `backend/.env` | `DB_PORT` | PostgreSQL port (default `5433`) |
| `backend/.env` | `DB_PASSWORD` | PostgreSQL password (default `postgres`) |
| `ml-backend/.env` | `HF_TOKEN` | Your [HuggingFace](https://huggingface.co/settings/tokens) API token |

---

## Stopping

```bash
docker compose down   # stop PostgreSQL
# Ctrl+C in each terminal tab to stop the other services
```

---

## Project Structure

```
web-app/
├── backend/          # Express REST API (TypeScript)
├── frontend/         # Next.js web client (TypeScript)
├── ml-backend/       # FastAPI RAG pipeline (Python)
└── docker-compose.yml
```
