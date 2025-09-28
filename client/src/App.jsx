import React, { useEffect, useState } from 'react'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Play from './pages/Play.jsx'
import Result from './pages/Result.jsx'
import History from './pages/History.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BottomNav from './components/BottomNav.jsx'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [page, setPage] = useState('dashboard')
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [lastSubmission, setLastSubmission] = useState(null)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  if (!token) return <Login onLogin={setToken} />

  return (
    <div className="container" style={{ paddingBottom: 64 }}>
      <div className="header">
        <h2>AI Quizzer</h2>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn ghost" onClick={() => setPage('dashboard')}>Home</button>
          <button className="btn ghost" onClick={() => setPage('history')}>History</button>
          <button className="btn ghost" onClick={() => setPage('leaderboard')}>Leaderboard</button>
          <button className="btn secondary" onClick={() => setToken('')}>Logout</button>
        </div>
      </div>

      {page === 'dashboard' && (
        <Dashboard
          token={token}
          onStart={(quiz) => { setActiveQuiz(quiz); setPage('play') }}
        />
      )}
      {page === 'play' && activeQuiz && (
        <Play
          token={token}
          quiz={activeQuiz}
          onExit={() => { setActiveQuiz(null); setPage('dashboard') }}
          onSubmitted={(submission) => { setLastSubmission(submission); setPage('result') }}
        />
      )}
      {page === 'result' && lastSubmission && (
        <Result
          submission={lastSubmission}
          onHome={() => setPage('dashboard')}
        />
      )}
      {page === 'history' && <History token={token} />}
      {page === 'leaderboard' && <Leaderboard token={token} />}

      <BottomNav current={page} onNavigate={setPage} />
    </div>
  )
}

export default App
