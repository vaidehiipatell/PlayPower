import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Leaderboard({ token }) {
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
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
      const res = await api(`/quizzes/leaderboard?${params.toString()}`, { token })
      setRows(res.results || [])
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <input placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} />
        <button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
      </div>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Rank</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subject</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Grade</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Score</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r._id}>
              <td style={{ borderBottom: '1px solid #eee' }}>{i + 1}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{r.quiz?.subject}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{r.quiz?.grade}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{r.score} / {r.maxScore}</td>
              <td style={{ borderBottom: '1px solid #eee' }}>{new Date(r.createdAt).toLocaleString()}</td>
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
