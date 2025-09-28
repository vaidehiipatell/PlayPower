import React, { useMemo, useState } from 'react'
import { api } from '../api'

export default function Play({ token, quiz, onExit, onSubmitted }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hint, setHint] = useState('')

  const q = quiz?.questions?.[index]
  const total = quiz?.questions?.length || 0
  const header = useMemo(() => `${quiz?.subject} • ${quiz?.grade}`, [quiz])

  function selectOption(value) {
    setAnswers((prev) => ({ ...prev, [index]: value }))
  }

  function next() {
    setHint('')
    setIndex((i) => Math.min(total - 1, i + 1))
  }

  function prev() {
    setHint('')
    setIndex((i) => Math.max(0, i - 1))
  }

  async function getHint() {
    if (!quiz) return
    setLoading(true)
    setError('')
    try {
      const res = await api(`/quizzes/${quiz._id}/hint/${index}`, { token })
      setHint(res.hint)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  async function submit() {
    setLoading(true)
    setError('')
    try {
      const payload = {
        answers: Object.entries(answers).map(([k, v]) => ({ questionIndex: Number(k), answer: v }))
      }
      const sub = await api(`/quizzes/${quiz._id}/submit`, { method: 'POST', token, body: payload })
      onSubmitted?.(sub)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  if (!quiz) return null

  return (
    <div className="quiz-wrap">
      <div className="row" style={{ alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button className="btn secondary" onClick={onExit}>Back</button>
        <div style={{ fontWeight: 700 }}>{header}</div>
        <div style={{ marginLeft: 'auto' }} className="badge">{`Question ${index + 1}/${total}`}</div>
      </div>

      <div className="card quiz-card">
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Question</div>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>{q?.text}</div>

        <div className="grid" style={{ gap: 10 }}>
          {q?.options?.map((op, i) => {
            const selected = answers[index] === op
            return (
              <button
                key={i}
                className={`option ${selected ? 'selected' : ''}`}
                onClick={() => selectOption(op)}
              >
                {op}
              </button>
            )
          })}
        </div>

        <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
          <button className="btn ghost" onClick={getHint} disabled={loading}>See Result ▾</button>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn secondary" onClick={prev} disabled={index===0}>Previous</button>
            {index < total - 1 ? (
              <button className="btn" onClick={next}>Next</button>
            ) : (
              <button className="btn" onClick={submit} disabled={loading}>Submit</button>
            )}
          </div>
        </div>

        {hint && (
          <div style={{ marginTop: 10, background: '#f8fbff', border: '1px solid var(--ring)', padding: 10, borderRadius: 10 }}>
            {hint}
          </div>
        )}

        {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  )
}
