import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function History({ token }) {
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [minScore, setMinScore] = useState('')
  const [maxScore, setMaxScore] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (subject) params.set('subject', subject)
      if (grade) params.set('grade', grade)
      if (minScore) params.set('minScore', minScore)
      if (maxScore) params.set('maxScore', maxScore)
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      const res = await api(`/quizzes/history?${params.toString()}`, { token })
      setRows(res.results || [])
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <input placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} />
        <input placeholder="Min Score" value={minScore} onChange={e => setMinScore(e.target.value)} />
        <input placeholder="Max Score" value={maxScore} onChange={e => setMaxScore(e.target.value)} />
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Filter'}</button>
      </div>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Grade</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Score</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Attempt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id}>
              <td style={{ borderBottom: '1px solid #eee' }}>{new Date(r.createdAt).toLocaleString()}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{r.quiz?.subject}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{r.quiz?.grade}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{r.score} / {r.maxScore}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{r.attempt}</td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan={5} style={{ padding: 12, color: '#666' }}>No results</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
