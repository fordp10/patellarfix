import { PHASES, getSessionType } from '../data/exercises'

export default function Home({ store, onStartSession }) {
  const { profile, isTodayComplete, currentStreak, totalCompleted, longestStreak, todaySession } = store
  const phase = PHASES[profile.currentPhase]
  const sessionType = getSessionType()
  const isFullDay = sessionType === 'full'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <div className="screen-header">
        <h1>PatellarFix</h1>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Greeting */}
        <p style={{ fontSize: 15, color: 'var(--text2)' }}>{greeting} 👋 Keep that recovery going.</p>

        {/* Today card */}
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: 16 }}>Today's Session</p>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>
                {isFullDay ? '💪 Strength + Stretch' : '🧘 Stretch Only'}
              </p>
            </div>
            <span className={`badge ${isFullDay ? 'badge-blue' : 'badge-green'}`}>
              {isFullDay ? '~10 min' : '~5 min'}
            </span>
          </div>

          {isTodayComplete ? (
            <div className="complete-banner">
              <p style={{ fontSize: 22 }}>🎉</p>
              <p style={{ fontWeight: 700, color: 'var(--green)', marginTop: 4 }}>Session Complete!</p>
              {todaySession && <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{todaySession.durationMinutes} min · Come back tomorrow</p>}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onStartSession}>
              ▶ Start Session
            </button>
          )}
        </div>

        {/* Streak row */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value" style={{ color: 'var(--orange)' }}>{currentStreak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value" style={{ color: 'var(--green)' }}>{totalCompleted}</div>
            <div className="stat-label">Sessions Done</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏅</div>
            <div className="stat-value" style={{ color: 'var(--blue)' }}>{longestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>

        {/* Current phase */}
        <div className="card" style={{ borderLeft: `4px solid ${phase.color}` }}>
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 22 }}>{phase.icon}</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: phase.color }}>{phase.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text2)' }}>{phase.subtitle}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>{phase.description}</p>
        </div>

        {/* Protocol info */}
        <ProtocolCard />
      </div>
    </div>
  )
}

function ProtocolCard() {
  return (
    <div className="card" style={{ marginBottom: 4 }}>
      <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📖 About This Protocol</p>
      {[
        ['🛡️ Phase 1 — Isometrics', 'Rio et al. (2015): Isometric contractions provide immediate pain relief without irritating the tendon.'],
        ['💪 Phase 2 — Heavy Slow Resistance', 'Kongsgaard et al. (2009): HSR at 3-0-3 tempo outperforms eccentric-only at 12-month follow-up.'],
        ['✅ Phase 3 — Progressive Loading', 'Bridges rehabilitation to sport and daily demands, completing tendon remodelling.'],
        ['🧘 Daily Stretching', 'Quad, hip flexor, calf and hamstring flexibility reduce load on the patellar tendon.'],
      ].map(([title, body]) => (
        <div key={title} style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--blue)' }}>{title}</p>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{body}</p>
        </div>
      ))}
    </div>
  )
}
