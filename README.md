<!-- EFFECTS-BLOCK:START -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=F6F1EA&height=180&section=header&text=Doc%20Intelligence%20Api&fontSize=44&fontColor=111111&desc=Scalable%20TypeScript%20API%20layer%20for%20document%20intelligence%20workflows%20with%20deployment-ready%20architecture.&descSize=14&descAlignY=68" alt="Doc Intelligence Api" />
</p>

<p align="center">
  <a href="https://github.com/Mohamedzuhair17/doc-intelligence-api"><img src="https://img.shields.io/badge/Repository-111111?style=for-the-badge&logo=github" alt="repo" /></a>
  <img src="https://img.shields.io/github/stars/Mohamedzuhair17/=for-the-badge&color=111111" alt="stars" />
  <img src="https://img.shields.io/github/forks/Mohamedzuhair17/=for-the-badge&color=111111" alt="forks" />
  <img src="https://img.shields.io/github/last-commit/Mohamedzuhair17/=for-the-badge&color=111111" alt="last commit" />`n  <a href="https://doc-api-indol.vercel.app"><img src="https://img.shields.io/badge/Live-Demo-111111?style=for-the-badge&logo=vercel" alt="live demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-TypeScript-F6F1EA?style=for-the-badge&labelColor=111111&color=F6F1EA" alt="stack" />
  <img src="https://img.shields.io/badge/Engineering-Production%20Grade-111111?style=for-the-badge" alt="engineering" />
</p>
<!-- EFFECTS-BLOCK:END -->

---

# Document AI Full Stack (Structured)

This repository contains:
- `backend/`  : FastAPI + Celery document AI API
- `frontend/` : React + Vite frontend UI

## Run with Docker Compose

1. From root:
   ```bash
   docker compose up --build
   ```
2. Backend API: http://localhost:8000
3. Frontend UI: http://localhost:5173

## Run locally without Docker

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## API Endpoints

- `POST /api/document-analyze`
- `GET /api/task/{task_id}`
- `GET /health`

## Notes

- Frontend `src/services/apiClient.ts` uses `VITE_API_URL` & `VITE_API_KEY`.
- Backend expects `x-api-key` header with secret from `backend/.env`.
