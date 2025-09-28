import React, { useEffect, useState } from 'react'
import { api } from '../api'

const SUBJECTS = [
  { key: 'HTML', icon: '📄' },
  { key: 'JAVASCRIPT', icon: '🟨' },
  { key: 'REACT', icon: '⚛️' },
  { key: 'C++', icon: '💠' },
  { key: 'PYTHON', icon: '🐍' },
]

export default function Dashboard({ token, onStart }) {
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('HTML')
  const [grade, setGrade] = useState('Grade 5')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recent, setRecent] = useState([])

  async function generateQuiz() {
    setLoading(true)
    setError('')
    try {
      const q = await api('/quizzes/generate', { method: 'POST', token, body: { subject, grade } })
      onStart?.(q)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  async function loadRecent() {
    try {
      const res = await api('/quizzes/history?limit=5', { token })
      setRecent(res.results?.slice(0,5) || [])
    } catch {}
  }
  useEffect(() => { loadRecent() }, [])

  const filtered = SUBJECTS.filter(s => s.key.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="banner card">
        <div>
          <div className="badge">ID-1809</div>
          <h3 style={{ margin: '8px 0' }}>Test Your Knowledge with Quizzes</h3>
          <div style={{ color: 'rgba(255,255,255,.9)', maxWidth: 520 }}>Quick interactive quizzes to validate concepts and level up.</div>
        </div>
        <button className="btn" onClick={generateQuiz} disabled={loading}>
          {loading ? 'Preparing...' : 'Play Now'}
        </button>
      </div>

      <div className="row searchbar">
        <input className="input" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="row" style={{ gap:8 }}>
          <input className="input" style={{ width:180 }} placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} />
          <input className="input" style={{ width:220 }} placeholder="Subject (any)" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
      </div>

      <section className="grid grid-3">
        {filtered.map(s => (
          <div key={s.key} className="category card" onClick={() => setSubject(s.key)} style={{ cursor:'pointer', border: subject===s.key? '2px solid var(--ring)': undefined }}>
            <div className="icon">{s.icon}</div>
            <div style={{ fontWeight: 600 }}>{s.key}</div>
          </div>
        ))}
      </section>

      <section className="card" style={{ padding: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h4>Recent Activity</h4>
          {error && <div style={{ color: 'crimson' }}>{error}</div>}
        </div>
        <div className="list">
          {recent.map((r) => (
            <div key={r._id} className="list-item">
              <div className="left">
                <div className="icon">🏷️</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.quiz?.subject} · {r.quiz?.grade}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{new Date(r.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="progress">{r.score}/{r.maxScore}</div>
            </div>
          ))}
          {!recent.length && (
            <div className="list-item">
              <div className="left"><div className="icon">🕒</div><div>No attempts yet</div></div>
              <button className="btn ghost" onClick={generateQuiz}>Start</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
