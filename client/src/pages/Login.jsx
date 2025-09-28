import React, { useState } from 'react'
import { api } from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('demo')
  const [password, setPassword] = useState('demo')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api('/auth/login', { method: 'POST', body: { username, password } })
      onLogin(res.token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          <div>Username</div>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>
          <div>Password</div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  )
}
