import React from 'react'

export default function BottomNav({ current, onNavigate }) {
  const items = [
    { key: 'dashboard', label: 'Home' },
    { key: 'play', label: 'Play' },
    { key: 'history', label: 'History' },
    { key: 'leaderboard', label: 'Top' },
  ]
  return (
    <div className="bottomnav">
      {items.map(it => (
        <button
          key={it.key}
          onClick={() => onNavigate(it.key)}
          style={{ fontWeight: current === it.key ? 700 : 500, color: current === it.key ? 'var(--primary)' : undefined }}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}
