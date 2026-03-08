from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import json, os, re
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"

def ask(prompt):
    r = client.chat.completions.create(model=MODEL, messages=[{"role":"user","content":prompt}], temperature=0.7)
    return r.choices[0].message.content

class StartRequest(BaseModel):
    role: str
    level: str

class EvaluateRequest(BaseModel):
    role: str
    level: str
    qa_pairs: list[dict]

class AnswerFeedback(BaseModel):
    question: str; answer: str; score: int; good: str; weak: str; interviewer_thought: str

class EvaluateResponse(BaseModel):
    feedbacks: list[AnswerFeedback]; overall_score: int; verdict: str; verdict_reason: str; one_liner: str

@app.get("/")
def root(): return {"message": "AI Interview Judge API is live"}

@app.get("/health")
def health(): return {"status": "ok"}

@app.get("/test-groq")
async def test_groq():
    try:
        return {"status": "working", "response": ask("say hi in one word").strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/start")
async def start_interview(req: StartRequest):
    prompt = f"""You are a strict technical interviewer. Generate exactly 5 interview questions for a {req.level} {req.role} candidate.
Mix 3 technical + 2 behavioral. Keep each concise.
Respond ONLY with raw JSON, no markdown:
{{"questions": ["Q1","Q2","Q3","Q4","Q5"]}}"""
    try:
        text = re.sub(r"```json|```", "", ask(prompt)).strip()
        data = json.loads(text)
        return {"questions": data["questions"], "role": req.role, "level": req.level}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate")
async def evaluate_interview(req: EvaluateRequest):
    qa_text = "\n".join([f"Q{i+1}: {p['question']}\nA{i+1}: {p['answer']}" for i,p in enumerate(req.qa_pairs)])
    prompt = f"""You are a brutally honest interviewer at Google. Evaluate this {req.level} {req.role} candidate.
{qa_text}
Respond ONLY with raw JSON, no markdown:
{{"feedbacks":[{{"question":"...","answer":"...","score":7,"good":"...","weak":"...","interviewer_thought":"I thought..."}}],"overall_score":65,"verdict":"Lean Hire","verdict_reason":"...","one_liner":"..."}}
Verdict must be one of: "Strong Hire","Lean Hire","Lean No Hire","Hard No Hire" """
    try:
        text = re.sub(r"```json|```", "", ask(prompt)).strip()
        data = json.loads(text)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))