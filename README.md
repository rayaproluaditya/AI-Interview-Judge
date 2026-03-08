# 🎯 AI Interview Judge

> Answer 5 questions. Get brutally honest feedback from an AI interviewer.

A full-stack AI-powered mock interview tool that simulates real tech interviews, evaluates your answers, and reveals what the interviewer was *actually* thinking.

![Tech Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square)
![Tech Stack](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?style=flat-square)
![Tech Stack](https://img.shields.io/badge/Deploy-Render%20%2B%20Vercel-black?style=flat-square)

---

## ✨ Features

- 🎭 **Role-specific questions** — SDE, ML Engineer, Data Scientist, PM, and more
- 📊 **Per-answer scoring** — score out of 10 with detailed breakdown
- 💭 **Interviewer's inner monologue** — the savage truth about your answer
- 🏆 **Final verdict** — Strong Hire / Lean Hire / Lean No Hire / Hard No Hire
- ⚡ **100% free** — uses Gemini 1.5 Flash free tier

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python, FastAPI, Pydantic |
| **Frontend** | React 18, CSS3 |
| **AI** | Google Gemini 1.5 Flash |
| **Backend Deploy** | Render (free tier) |
| **Frontend Deploy** | Vercel (free tier) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- [Gemini API Key](https://aistudio.google.com/app/apikey) (free)

---

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Run locally
uvicorn main:app --reload
```

API will be live at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

---

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:8000

npm start
```

Frontend will run at `http://localhost:3000`

---

## ☁️ Deployment

### Backend → Render

1. Push backend folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, set root to `/backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `GEMINI_API_KEY=your_key`
7. Deploy!

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your repo, set root to `/frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-render-url.onrender.com`
4. Deploy!

---

## 📡 API Endpoints

### `POST /start`
Generate 5 interview questions for a role and level.

**Request:**
```json
{
  "role": "ML Engineer",
  "level": "Fresher"
}
```

**Response:**
```json
{
  "questions": ["Q1...", "Q2...", "Q3...", "Q4...", "Q5..."],
  "role": "ML Engineer",
  "level": "Fresher"
}
```

---

### `POST /evaluate`
Evaluate all answers and return detailed feedback + verdict.

**Request:**
```json
{
  "role": "ML Engineer",
  "level": "Fresher",
  "qa_pairs": [
    { "question": "...", "answer": "..." }
  ]
}
```

**Response:**
```json
{
  "feedbacks": [
    {
      "question": "...",
      "answer": "...",
      "score": 7,
      "good": "Strong understanding of core concept",
      "weak": "Missed time complexity discussion",
      "interviewer_thought": "I thought this was decent but shallow"
    }
  ],
  "overall_score": 68,
  "verdict": "Lean Hire",
  "verdict_reason": "...",
  "one_liner": "..."
}
```

---

## 🗂️ Project Structure

```
interview-judge/
├── backend/
│   ├── main.py              # FastAPI app with all endpoints
│   ├── requirements.txt
│   ├── render.yaml          # Render deployment config
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js           # Full React app (single file)
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── README.md
```

---

## 🧠 How It Works

1. User selects a **role** and **experience level**
2. Backend calls **Gemini API** to generate 5 tailored questions
3. User answers each question in the interview UI
4. All Q&A pairs are sent to backend for evaluation
5. Gemini evaluates answers with detailed prompting
6. Frontend displays per-answer scores, feedback, and the final verdict

---

## 🔮 Future Ideas

- [ ] Voice input for answers (Web Speech API)
- [ ] Save and share interview report as PDF
- [ ] Leaderboard of scores by role
- [ ] Follow-up questions based on weak answers
- [ ] Resume upload to personalize questions

---

## 📄 License

MIT — feel free to use, fork, and build on top of this.

---

*Built with FastAPI + Gemini + React | Deployed on Render + Vercel*
