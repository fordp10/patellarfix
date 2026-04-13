import { useState, useEffect, useRef } from 'react'
import { getSessionType, getSessionExercises } from '../data/exercises'

export default function SessionMode({ store, onClose }) {
  const { profile, saveSession } = store
  const sessionType = getSessionType()
  const exercises = getSessionExercises(profile.currentPhase, sessionType)

  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState([])
  const [isResting, setIsResting] = useState(false)
  const [restLeft, setRestLeft] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showAbandon, setShowAbandon] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)

  const current = exercises[index]
  const progress = exercises.length > 0 ? index / exercises.length : 0

  // Rest countdown
  useEffect(() => {
    if (isResting && restLeft > 0 && !isPaused) {
      timerRef.current = setTimeout(() => setRestLeft(r => r - 1), 1000)
    } else if (isResting && restLeft === 0) {
      setIsResting(false)
      setIndex(i => i + 1)
    }
    return () => clearTimeout(timerRef.current)
  }, [isResting, restLeft, isPaused])

  const markDone = () => {
    const newCompleted = [...completed, current.id]
    setCompleted(newCompleted)

    if (index >= exercises.length - 1) {
      // Finish session
      const session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        completedExerciseIds: newCompleted,
        totalExercises: exercises.length,
        sessionType,
        isComplete: true,
        durationMinutes: Math.max(1, Math.round((Date.now() - startTimeRef.current) / 60000)),
      }
      saveSession(session)
      setIsDone(true)
    } else {
      setIsPaused(false)
      setRestLeft(current.restSeconds)
      setIsResting(true)
    }
  }

  const skipRest = () => {
    clearTimeout(timerRef.current)
    setIsResting(false)
    setIndex(i => i + 1)
  }

  if (isDone) return <CompleteScreen onClose={onClose} duration={Math.round((Date.now() - startTimeRef.current) / 60000)} />

  if (isResting) {
    return (
      <div className="overlay">
        <div className="rest-screen">
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text2)' }}>Rest</p>
          <CircleTimer seconds={restLeft} total={current.restSeconds} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>Next up</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              {index + 1 < exercises.length ? exercises[index + 1].name : 'Finish!'}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setIsPaused(p => !p)} style={{ maxWidth: 280 }}>
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button className="btn btn-ghost" onClick={skipRest} style={{ maxWidth: 280 }}>Skip Rest</button>
        </div>
      </div>
    )
  }

  const catColors = { Isometric: '#F97316', Strength: '#2563EB', Stretch: '#16A34A' }
  const color = catColors[current?.category] || '#2563EB'

  return (
    <div className="overlay">
      {/* Top bar */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setShowAbandon(true)} style={{ border: 'none', background: 'var(--card2)', borderRadius: '50%', width: 36, height: 36, fontSize: 16, cursor: 'pointer' }}>✕</button>
        <div style={{ flex: 1 }}>
          <div className="progress-bar" style={{ marginBottom: 4 }}>
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text2)', textAlign: 'center' }}>{index + 1} of {exercises.length}</p>
        </div>
        <button onClick={() => setShowDetail(!showDetail)} style={{ border: 'none', background: 'var(--card2)', borderRadius: '50%', width: 36, height: 36, fontSize: 16, cursor: 'pointer' }}>ℹ</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 0' }}>
        {/* Exercise header */}
        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: `${color}18`, color, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{current.category}</span>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{current.name}</h2>
        <p style={{ fontSize: 16, fontWeight: 700, color, marginBottom: 16 }}>{current.sets} sets × {current.reps}</p>

        {/* Visual */}
        <div style={{ background: `${color}10`, borderRadius: 'var(--radius)', padding: '28px 20px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 64 }}>{current.category === 'Stretch' ? '🧘' : current.category === 'Isometric' ? '🧱' : '💪'}</div>
          {current.videoURL && (
            <a href={current.videoURL} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--red)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              ▶ Watch video ↗
            </a>
          )}
        </div>

        {/* Instructions */}
        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Instructions</p>
        {current.instructions.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <span style={{ minWidth: 22, height: 22, borderRadius: '50%', background: `${color}18`, color, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text)' }}>{step}</p>
          </div>
        ))}

        {/* Tips */}
        <p style={{ fontSize: 14, fontWeight: 700, margin: '16px 0 8px' }}>Key Tips</p>
        {current.tips.slice(0, 3).map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
            <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{tip}</p>
          </div>
        ))}
      </div>

      {/* Bottom action */}
      <div style={{ padding: '12px 20px 36px', borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
        <button className="btn btn-primary" onClick={markDone}>
          {index >= exercises.length - 1 ? '🎉 Finish Session' : '✓ Done — Next Exercise →'}
        </button>
        {index > 0 && (
          <button onClick={() => { setIndex(i => i - 1); setCompleted(c => c.slice(0, -1)) }} style={{ border: 'none', background: 'none', color: 'var(--text2)', fontSize: 14, cursor: 'pointer', width: '100%', padding: '10px 0 0' }}>← Previous</button>
        )}
      </div>

      {/* Abandon dialog */}
      {showAbandon && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }}>
          <div style={{ background: 'var(--card)', borderRadius: '20px 20px 0 0', padding: '24px 24px 48px', width: '100%' }}>
            <p style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Abandon session?</p>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>Progress won't be saved.</p>
            <button className="btn btn-danger" onClick={onClose}>Abandon</button>
            <button className="btn btn-ghost mt-12" onClick={() => setShowAbandon(false)}>Keep Going</button>
          </div>
        </div>
      )}
    </div>
  )
}

function CircleTimer({ seconds, total }) {
  const r = 80
  const circ = 2 * Math.PI * r
  const fill = total > 0 ? (seconds / total) * circ : 0

  return (
    <div className="timer-circle">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--blue)" strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={circ - fill}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="timer-text">
        <span className="timer-number">{seconds}</span>
        <span className="timer-unit">sec</span>
      </div>
    </div>
  )
}

function CompleteScreen({ onClose, duration }) {
  return (
    <div className="overlay" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 32 }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Session Complete!</h2>
      <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 24 }}>Every session builds a stronger, healthier tendon. Consistency is the cure.</p>
      <div style={{ background: 'var(--orange-light)', border: '1px solid #FED7AA', borderRadius: 'var(--radius)', padding: '16px 24px', marginBottom: 32 }}>
        <p style={{ fontSize: 28, marginBottom: 4 }}>🔥</p>
        <p style={{ fontWeight: 700, color: 'var(--orange)' }}>Streak keeps going!</p>
        {duration > 0 && <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{duration} min session</p>}
      </div>
      <button className="btn btn-green" style={{ maxWidth: 300, width: '100%' }} onClick={onClose}>Back to Home</button>
    </div>
  )
}
