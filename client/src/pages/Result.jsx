import React from 'react'

export default function Result({ submission, onHome }) {
  if (!submission) return null
  const scoreText = `${submission.score}/${submission.maxScore}`

  function share() {
    const text = `I scored ${scoreText} in AI Quizzer!`
    if (navigator.share) {
      navigator.share({ title: 'My Quiz Result', text })
    } else {
      navigator.clipboard?.writeText(text)
      alert('Copied result to clipboard!')
    }
  }

  return (
    <div className="quiz-wrap card" style={{ padding: 20 }}>
      <div className="center">
        <div className="score-badge">
          <div>
            <div style={{ fontSize: 14 }}>Your Score</div>
            <div style={{ fontSize: 36, lineHeight: '40px', fontWeight: 800 }}>{scoreText}</div>
          </div>
        </div>
        <h3>Congratulation</h3>
        <div style={{ color: 'var(--muted)', marginBottom: 20 }}>Great job! You Did It</div>
      </div>

      {!!submission.tips?.length && (
        <div style={{ margin: '0 auto 16px', maxWidth: 520 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Suggestions</div>
          <ul>
            {submission.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      <div className="quiz-wrap" style={{ display: 'grid', gap: 10 }}>
        <button className="btn" onClick={share}>Share</button>
        <button className="btn secondary" onClick={onHome}>Back to Home</button>
      </div>
    </div>
  )
}
