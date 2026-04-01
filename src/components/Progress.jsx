import { useState } from 'react'
import { PHASES } from '../data/exercises'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function MonthCalendar({ year, month, hasCompletedOn }) {
  const today = new Date()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="calendar-grid">
      {DAYS.map((d, i) => <div key={i} className="cal-day-label">{d}</div>)}
      {cells.map((day, i) => {
        if (!day) return <div key={i} />
        const date = new Date(year, month, day)
        const done = hasCompletedOn(date)
        const isToday = isSameDay(date, today)
        const future = date > today
        return (
          <div key={i} className={`cal-day ${done ? 'done' : ''} ${isToday && !done ? 'today' : ''} ${future ? 'future' : ''}`}>
            {day}
          </div>
        )
      })}
    </div>
  )
}

export default function Progress({ store }) {
  const { profile, currentStreak, longestStreak, totalCompleted, hasCompletedOn } = store
  const today = new Date()
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [calYear, setCalYear] = useState(today.getFullYear())

  const monthName = new Date(calYear, calMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    const next = new Date(calYear, calMonth + 1, 1)
    if (next <= today) {
      if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
      else setCalMonth(m => m + 1)
    }
  }

  const canGoForward = new Date(calYear, calMonth + 1, 1) <= today

  const weeksElapsed = profile.startDate
    ? Math.floor((Date.now() - new Date(profile.startDate)) / (7 * 24 * 60 * 60 * 1000))
    : 0

  return (
    <div>
      <div className="screen-header"><h1>Progress</h1></div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Streak hero */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '1px solid #FED7AA' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>Current Streak</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 52, fontWeight: 800, color: 'var(--orange)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{currentStreak}</span>
                <span style={{ fontSize: 18, color: 'var(--text2)' }}>day{currentStreak !== 1 ? 's' : ''}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
                {store.isTodayComplete ? 'Keep it going tomorrow!' : 'Complete today to build your streak'}
              </p>
            </div>
            <span style={{ fontSize: 56 }}>🔥</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏅</div>
            <div className="stat-value">{longestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-value">W{weeksElapsed + 1}</div>
            <div className="stat-label">Current Week</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
            <button onClick={prevMonth} style={{ border: 'none', background: 'var(--card2)', borderRadius: '50%', width: 32, height: 32, fontSize: 16, cursor: 'pointer' }}>‹</button>
            <p style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 15 }}>{monthName}</p>
            <button onClick={nextMonth} disabled={!canGoForward} style={{ border: 'none', background: canGoForward ? 'var(--card2)' : 'transparent', borderRadius: '50%', width: 32, height: 32, fontSize: 16, cursor: canGoForward ? 'pointer' : 'default', opacity: canGoForward ? 1 : 0.3 }}>›</button>
          </div>
          <MonthCalendar year={calYear} month={calMonth} hasCompletedOn={hasCompletedOn} />
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: 'var(--text2)' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--blue)' }} /> Completed
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, color: 'var(--text2)' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', boxShadow: '0 0 0 1.5px var(--blue)' }} /> Today
            </div>
          </div>
        </div>

        {/* Phase progress */}
        <div className="card">
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Phase Progress</p>
          {[1, 2, 3].map(p => {
            const ph = PHASES[p]
            const isCurrent = p === profile.currentPhase
            const isDone = p < profile.currentPhase
            return (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: p < 3 ? 12 : 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: isDone ? 'var(--green)' : isCurrent ? ph.color : 'var(--card2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {isDone ? '✓' : ph.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: isCurrent ? 700 : 400, opacity: isDone ? 0.6 : 1 }}>{ph.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text2)' }}>{ph.subtitle}</p>
                </div>
                {isCurrent && <span style={{ fontSize: 11, fontWeight: 700, color: ph.color, padding: '2px 8px', background: `${ph.color}18`, borderRadius: 99 }}>Active</span>}
                {isDone && <span style={{ color: 'var(--green)' }}>✅</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
