# AI Quizzer Backend (Express + MongoDB)

AI-powered quiz microservice with mock JWT auth, AI-assisted quiz generation/evaluation, hints, adaptive difficulty, history filters, retry attempts, and leaderboard.

## Features
- Authentication: mock login accepts any username/password and returns JWT.
- Quiz generation: AI-assisted (Groq if configured, otherwise mock) with adaptive difficulty.
- Submit answers: AI-evaluated score, returns tips for improvement.
- Hint endpoint: AI-generated hint per question.
- History: filter by subject, grade, score range, date range.
- Retry: new submission attempt while keeping history.
- Leaderboard (bonus): top scores per subject/grade.
- Swagger docs at `/api-docs`.
- Dockerfile provided. Postman collection included.

## Run locally
1. Copy `.env.example` to `.env` and adjust values.
2. Start MongoDB locally or provide `MONGO_URI`.
3. Install deps and run:

```bash
npm install
npm run dev
```

API runs on http://localhost:8080

## Environment
```
PORT=8080
MONGO_URI=mongodb://localhost:27017/ai_quizzer
JWT_SECRET=change_me
GROQ_API_KEY= # optional
GROQ_MODEL=llama3-70b-8192
```

## AI Integration (Groq)
- Uses Groq Chat Completions-compatible endpoint at `https://api.groq.com/openai/v1/chat/completions`.
- Provide `GROQ_API_KEY` to enable. Without it, the service uses deterministic mock generation/evaluation.

## Docker
Build and run:
```bash
docker build -t ai-quizzer-backend .
docker run -p 8080:8080 --env-file .env ai-quizzer-backend
```

## Postman Collection
Import `postman_collection.json` and set the `token` variable after login.

## MongoDB Schema Notes
Using Mongoose models: `User`, `Quiz`, `Submission`. An index enforces unique (`user`, `quiz`, `attempt`). You can add indexes via Mongo shell if needed.

## Known Issues
- Groq JSON outputs may occasionally be non-strict JSON; code falls back to mock behavior.
- No rate limiting. Consider adding for production.
- Email notifications and Redis caching not yet implemented.
