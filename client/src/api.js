const API_BASE = (() => {
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return 'http://localhost:8080'
  return '/api'
})()

export async function api(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let data
  try { data = text ? JSON.parse(text) : {} } catch { data = { raw: text } }
  if (!res.ok) throw new Error(data?.error || res.statusText)
  return data
}
