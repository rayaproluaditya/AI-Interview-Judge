import React, { useState, useEffect, useRef } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const ROLES = ['SDE', 'ML Engineer', 'Data Scientist', 'Backend Engineer', 'Frontend Engineer', 'PM'];
const LEVELS = ['Fresher', '1-2 years', '3+ years'];

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080808;
    color: #e8e8e0;
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
  }

  .mono { font-family: 'JetBrains Mono', monospace; }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px 80px;
    position: relative;
    overflow: hidden;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,70,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,70,0,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  }

  .content { position: relative; z-index: 1; width: 100%; max-width: 780px; }

  /* Header */
  .header { text-align: center; margin-bottom: 56px; }
  .header-tag {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #ff4600;
    border: 1px solid #ff4600;
    padding: 4px 12px;
    margin-bottom: 20px;
  }
  .header h1 {
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -2px;
    color: #f0ede6;
  }
  .header h1 span { color: #ff4600; }
  .header p {
    margin-top: 14px;
    color: #666;
    font-size: 15px;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Cards */
  .card {
    background: #111;
    border: 1px solid #222;
    padding: 36px;
    margin-bottom: 24px;
    position: relative;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ff4600, transparent);
  }

  /* Setup screen */
  .setup-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 12px;
  }
  .pill-group { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
  .pill {
    padding: 8px 18px;
    border: 1px solid #2a2a2a;
    background: transparent;
    color: #777;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .pill:hover { border-color: #ff4600; color: #ff4600; }
  .pill.active { border-color: #ff4600; background: #ff460015; color: #ff4600; }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    background: #ff4600;
    color: #fff;
    border: none;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    width: 100%;
    justify-content: center;
  }
  .btn:hover { background: #e03d00; transform: translateY(-1px); }
  .btn:disabled { background: #333; color: #555; cursor: not-allowed; transform: none; }
  .btn-ghost {
    background: transparent;
    border: 1px solid #333;
    color: #666;
  }
  .btn-ghost:hover { border-color: #ff4600; color: #ff4600; background: transparent; }

  /* Interview screen */
  .q-number {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #ff4600;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .question-text {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.4;
    color: #f0ede6;
    margin-bottom: 24px;
  }
  .answer-box {
    width: 100%;
    background: #0d0d0d;
    border: 1px solid #2a2a2a;
    color: #e8e8e0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    padding: 16px;
    resize: vertical;
    min-height: 120px;
    outline: none;
    line-height: 1.6;
    transition: border-color 0.15s;
  }
  .answer-box:focus { border-color: #ff4600; }
  .progress-bar {
    height: 3px;
    background: #1a1a1a;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: #ff4600;
    transition: width 0.4s ease;
  }

  /* Loading */
  .loading {
    text-align: center;
    padding: 60px 20px;
  }
  .loading-ring {
    width: 48px;
    height: 48px;
    border: 2px solid #1a1a1a;
    border-top-color: #ff4600;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 24px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #555;
  }
  .loading-text span {
    color: #ff4600;
    animation: blink 1s ease-in-out infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* Results */
  .verdict-banner {
    padding: 28px 36px;
    margin-bottom: 28px;
    border: 1px solid #222;
    position: relative;
    overflow: hidden;
  }
  .verdict-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.06;
  }
  .verdict-banner.strong-hire { border-color: #00c87a; }
  .verdict-banner.strong-hire::before { background: #00c87a; }
  .verdict-banner.lean-hire { border-color: #88c800; }
  .verdict-banner.lean-hire::before { background: #88c800; }
  .verdict-banner.lean-no-hire { border-color: #f5a623; }
  .verdict-banner.lean-no-hire::before { background: #f5a623; }
  .verdict-banner.hard-no-hire { border-color: #ff4600; }
  .verdict-banner.hard-no-hire::before { background: #ff4600; }

  .verdict-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }
  .verdict-title {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
  }
  .verdict-score {
    font-family: 'JetBrains Mono', monospace;
    font-size: 48px;
    font-weight: 500;
    float: right;
    margin-top: -48px;
    opacity: 0.9;
  }
  .one-liner {
    margin-top: 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #888;
    font-style: italic;
  }

  .feedback-card {
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    padding: 28px;
    margin-bottom: 16px;
  }
  .feedback-q {
    font-size: 15px;
    font-weight: 700;
    color: #ccc;
    margin-bottom: 6px;
  }
  .feedback-a {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #444;
    margin-bottom: 20px;
    line-height: 1.5;
    border-left: 2px solid #222;
    padding-left: 12px;
  }
  .feedback-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .feedback-item { }
  .feedback-item-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .feedback-item-label.good { color: #00c87a; }
  .feedback-item-label.weak { color: #ff4600; }
  .feedback-item-text { font-size: 13px; color: #aaa; line-height: 1.5; }

  .thought-box {
    background: #111;
    border-left: 3px solid #ff4600;
    padding: 12px 16px;
    margin-top: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #888;
    font-style: italic;
  }
  .thought-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #ff4600;
    margin-bottom: 6px;
    font-style: normal;
  }

  .score-badge {
    float: right;
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 500;
    color: #ff4600;
  }

  @media (max-width: 600px) {
    .card { padding: 24px 20px; }
    .feedback-row { grid-template-columns: 1fr; }
    .verdict-score { float: none; margin-top: 12px; font-size: 36px; }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function verdictClass(verdict) {
  if (!verdict) return '';
  return verdict.toLowerCase().replace(/ /g, '-');
}

function verdictColor(verdict) {
  const map = {
    'Strong Hire': '#00c87a',
    'Lean Hire': '#88c800',
    'Lean No Hire': '#f5a623',
    'Hard No Hire': '#ff4600',
  };
  return map[verdict] || '#ff4600';
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function SetupScreen({ onStart }) {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');

  return (
    <div className="card" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="setup-label">Select Role</div>
      <div className="pill-group">
        {ROLES.map(r => (
          <button key={r} className={`pill ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>{r}</button>
        ))}
      </div>

      <div className="setup-label">Experience Level</div>
      <div className="pill-group">
        {LEVELS.map(l => (
          <button key={l} className={`pill ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>{l}</button>
        ))}
      </div>

      <button
        className="btn"
        disabled={!role || !level}
        onClick={() => onStart(role, level)}
        style={{ marginTop: 12 }}
      >
        Start Interview →
      </button>
    </div>
  );
}

function InterviewScreen({ questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const textRef = useRef(null);

  useEffect(() => { textRef.current?.focus(); }, [current]);

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
    else {
      setSubmitting(true);
      onFinish(questions.map((q, i) => ({ question: q, answer: answers[i] })));
    }
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="card" key={current} style={{ animation: 'slideIn 0.3s ease' }}>
        <div className="q-number">Question {current + 1} of {questions.length}</div>
        <div className="question-text">{questions[current]}</div>
        <textarea
          ref={textRef}
          className="answer-box"
          placeholder="Type your answer here... (be as detailed as you'd be in a real interview)"
          value={answers[current]}
          onChange={e => {
            const updated = [...answers];
            updated[current] = e.target.value;
            setAnswers(updated);
          }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          {current > 0 && (
            <button className="btn btn-ghost" style={{ width: 'auto', flex: '0 0 auto' }} onClick={() => setCurrent(c => c - 1)}>
              ← Back
            </button>
          )}
          <button
            className="btn"
            onClick={handleNext}
            disabled={!answers[current].trim() || submitting}
          >
            {current === questions.length - 1 ? 'Submit Interview →' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen({ message }) {
  return (
    <div className="loading">
      <div className="loading-ring" />
      <div className="loading-text">{message} <span>_</span></div>
    </div>
  );
}

function ResultsScreen({ result, role, level, onRestart }) {
  const color = verdictColor(result.verdict);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      {/* Verdict Banner */}
      <div className={`verdict-banner ${verdictClass(result.verdict)}`}>
        <div className="verdict-label">Final Decision</div>
        <div className="verdict-score mono" style={{ color }}>{result.overall_score}<span style={{ fontSize: 20, color: '#444' }}>/100</span></div>
        <div className="verdict-title" style={{ color }}>{result.verdict}</div>
        <div className="one-liner">"{result.one_liner}"</div>
        <div style={{ marginTop: 14, fontSize: 13, color: '#666', lineHeight: 1.6 }}>{result.verdict_reason}</div>
      </div>

      {/* Per-question feedback */}
      <div className="mono" style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: '#444', marginBottom: 16 }}>
        Answer Breakdown
      </div>
      {result.feedbacks.map((fb, i) => (
        <div className="feedback-card" key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div className="feedback-q">Q{i + 1}. {fb.question}</div>
            <div className="score-badge">{fb.score}/10</div>
          </div>
          <div className="feedback-a">"{fb.answer}"</div>

          <div className="feedback-row">
            <div className="feedback-item">
              <div className="feedback-item-label good">✓ What Worked</div>
              <div className="feedback-item-text">{fb.good}</div>
            </div>
            <div className="feedback-item">
              <div className="feedback-item-label weak">✗ What Was Missing</div>
              <div className="feedback-item-text">{fb.weak}</div>
            </div>
          </div>

          <div className="thought-box">
            <div className="thought-label">💭 Interviewer's Inner Monologue</div>
            {fb.interviewer_thought}
          </div>
        </div>
      ))}

      <button className="btn btn-ghost" onClick={onRestart} style={{ marginTop: 8 }}>
        ↺ Try Again
      </button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState('setup'); // setup | loading-q | interview | loading-e | results
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState({ role: '', level: '' });
  const [error, setError] = useState('');

  const handleStart = async (role, level) => {
    setMeta({ role, level });
    setScreen('loading-q');
    setError('');
    try {
      const res = await fetch(`${API}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, level }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setQuestions(data.questions);
      setScreen('interview');
    } catch (e) {
      setError(`Failed to load questions: ${e.message}`);
      setScreen('setup');
    }
  };

  const handleFinish = async (qaPairs) => {
    setScreen('loading-e');
    setError('');
    try {
      const res = await fetch(`${API}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: meta.role, level: meta.level, qa_pairs: qaPairs }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setResult(data);
      setScreen('results');
    } catch (e) {
      setError(`Failed to evaluate: ${e.message}`);
      setScreen('interview');
    }
  };

  const handleRestart = () => {
    setScreen('setup');
    setQuestions([]);
    setResult(null);
    setError('');
  };

  return (
    <>
      <style>{css}</style>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
      `}</style>
      <div className="grid-bg" />
      <div className="app">
        <div className="content">
          <div className="header">
            <div className="header-tag">AI-Powered</div>
            <h1>Interview <span>Judge</span></h1>
            <p className="mono">// answer 5 questions. get brutally honest feedback.</p>
          </div>

          {error && (
            <div style={{ background: '#1a0800', border: '1px solid #ff4600', padding: '14px 20px', marginBottom: 24, fontFamily: 'JetBrains Mono', fontSize: 13, color: '#ff4600' }}>
              ⚠ {error}
            </div>
          )}

          {screen === 'setup' && <SetupScreen onStart={handleStart} />}
          {screen === 'loading-q' && <LoadingScreen message="Generating interview questions" />}
          {screen === 'interview' && <InterviewScreen questions={questions} onFinish={handleFinish} />}
          {screen === 'loading-e' && <LoadingScreen message="Judging your answers" />}
          {screen === 'results' && <ResultsScreen result={result} role={meta.role} level={meta.level} onRestart={handleRestart} />}

          <div style={{ textAlign: 'center', marginTop: 48, fontFamily: 'JetBrains Mono', fontSize: 11, color: '#2a2a2a', letterSpacing: 2 }}>
            BUILT WITH FASTAPI + GEMINI + REACT
          </div>
        </div>
      </div>
    </>
  );
}
