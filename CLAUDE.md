# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a full-stack LangChain demo application with a Next.js frontend and FastAPI backend communicating over HTTP.

### Structure
- `frontend/` - Next.js 14 React application (TypeScript)
- `backend/` - FastAPI Python server with LangChain integration
- Frontend runs on port 3000, backend on port 8000

### Key Components
- **Backend (`backend/main.py`)**: FastAPI server with CORS, uses LangChain + OpenAI GPT-4o-mini
- **Frontend (`frontend/app/page.tsx`)**: Single-page chat interface with message history
- **API Integration**: Frontend fetches to `/chat` endpoint with `ChatRequest`/`ChatResponse` models

## Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm run dev        # Start development server on port 3000
npm run build      # Build for production
npm run start      # Start production server on port 3000
npm run lint       # Run ESLint
```

### Backend (FastAPI)
```bash
cd backend
# Create/activate virtual environment first
python -m venv myenv
source myenv/bin/activate  # Linux/Mac
# myenv\Scripts\activate   # Windows

pip install -r requirements.txt
python main.py     # Start FastAPI server on port 8000
```

## Environment Setup

Both frontend and backend require environment files:
- `frontend/.env.local` - Set `NEXT_PUBLIC_API_BASE` if backend URL differs from http://localhost:8000
- `backend/.env` - Must contain `OPENAI_API_KEY` for LangChain integration

## Key Dependencies

### Frontend
- Next.js 14 with React 18
- TypeScript with strict mode
- No external UI libraries (vanilla styling)

### Backend
- FastAPI with Uvicorn
- LangChain with OpenAI integration
- Pydantic for request/response models
- python-dotenv for environment variables