import { useState, useEffect, useRef } from 'react'
import { getSessionType, getSessionExercises } from '../data/exercises'

export default function SessionMode({ store, onClose }) {
  const { profile, saveSession, checkPhaseAdvancement } = store
  const sessionType = getSessionType()
  const exercises = getSessionExercises(profile.currentPhase, sessionType)

  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState([])
  const [phase, setPhase] = useState('exercise') // 'exercise' | 'hold' | 'rest' | 'done'
  const [restLeft, setRestLeft] = useState(0)
  const [holdLeft, setHoldLeft] = useState(0)
  const [holdSide, setHoldSide] = useState(1)
  const [showAbandon, setShowAbandon] = useState(false)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef(null)

  const current = exercises[index]
  const progress = exercises.length > 0 ? index / exercises.length : 0
  const isTimed = !!current?.holdSeconds

  useEffect(() => {
    clearTimeout(timerRef.current)

    if (phase === 'hold' && holdLeft > 0) {
      timerRef.current = setTimeout(() => setHoldLeft(s => s - 1), 1000)
    } else if (phase === 'hold' && holdLeft === 0) {
      const totalSides = current.holdSides || 1
      if (holdSide < totalSides) {
        setHoldSide(s => s + 1)
        setHoldLeft(current.holdSeconds)
      } else {
        advanceAfterExercise()
      }
    } else if (phase === 'rest' && restLeft > 0) {
      timerRef.current = setTimeout(() => setRestLeft(s => s - 1), 1000)
    } else if (phase === 'rest' && restLeft === 0) {
      setPhase('exercise')
      setIndex(i => i + 1)
      setHoldSide(1)
    }

    return () => clearTimeout(timerRef.current)
  }, [phase, holdLeft, restLeft, holdSide])

  const startHold = () => {
    setHoldSide(1)
    setHoldLeft(current.holdSeconds)
    setPhase('hold')
  }

  const advanceAfterExercise = () => {
    const newCompleted = [...completed, current.id]
    setCompleted(newCompleted)

    if (index >= exercises.length - 1) {
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
      checkPhaseAdvancement([...store.sessions, session])
      setPhase('done')
    } else {
      setRestLeft(current.restSeconds)
      setPhase('rest')
    }
  }

  const skipHold = () => {
    clearTimeout(timerRef.current)
    const totalSides = current.holdSides || 1
    if (holdSide < totalSides) {
      setHoldSide(s => s + 1)
      setHoldLeft(current.holdSeconds)
    } else {
      advanceAfterExercise()
    }
  }

  const skipRest = () => {
    clearTimeout(timerRef.current)
    setPhase('exercise')
    setIndex(i => i + 1)
    setHoldSide(1)
  }

  if (phase === 'done') return <CompleteScreen onClose={onClose} duration={Math.round((Date.now() - startTimeRef.current) / 60000)} />

  if (phase === 'rest') {
    return (
      <div className="overlay">
        <div className="rest-screen">
          <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--text2)' }}>Rest</p>
          <CircleTimer seconds={restLeft} total={current.restSeconds} color="var(--blue)" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>Next up</p>
            <p style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
              {index + 1 < exercises.length ? exercises[index + 1].name : 'Finish!'}
            </p>
          </div>
          <button className="btn btn-ghost" onClick={skipRest} style={{ maxWidth: 280 }}>Skip Rest</button>
        </div>
      </div>
    )
  }

  if (phase === 'hold') {
    const totalSides = current.holdSides || 1
    const sideLabel = totalSides > 1 ? (holdSide === 1 ? 'Left side' : 'Right side') : null
    const catColors = { Isometric: '#F97316', Strength: '#2563EB', Stretch: '#16A34A' }
    const color = catColors[current.category] || '#2563EB'

    return (
      <div className="overlay">
        <div className="rest-screen">
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 22, fontWeight: 800 }}>{current.name}</p>
            {sideLabel && (
              <p style={{ fontSize: 16, fontWeight: 700, color, marginTop: 6 }}>{sideLabel}</p>
            )}
            {totalSides > 1 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {Array.from({ length: totalSides }, (_, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < holdSide ? color : 'var(--border)', transition: 'background 0.3s' }} />
                ))}
              </div>
            )}
          </div>

          <CircleTimer seconds={holdLeft} total={current.holdSeconds} color={color} />

          <p style={{ fontSize: 14, color: 'var(--text2)', textAlign: 'center', maxWidth: 260 }}>
            {current.category === 'Isometric'
              ? 'Hold this position. Breathe steadily. Pain up to 4/10 is okay.'
              : 'Hold the stretch. Breathe and relax into it. Do not bounce.'}
          </p>

          <button className="btn btn-ghost" onClick={skipHold} style={{ maxWidth: 280 }}>
            {totalSides > 1 && holdSide < totalSides ? 'Skip → Switch Side' : 'Skip Hold'}
          </button>
        </div>
      </div>
    )
  }

  const catColors = { Isometric: '#F97316', Strength: '#2563EB', Stretch: '#16A34A' }
  const color = catColors[current?.category] || '#2563EB'

  return (
    <div className="overlay">
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setShowAbandon(true)} style={{ border: 'none', background: 'var(--card2)', borderRadius: '50%', width: 36, height: 36, fontSize: 16, cursor: 'pointer' }}>✕</button>
        <div style={{ flex: 1 }}>
          <div className="progress-bar" style={{ marginBottom: 4 }}>
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text2)', textAlign: 'center' }}>{index + 1} of {exercises.length}</p>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '20px 20px 0' }}>
        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: `${color}18`, color, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{current.category}</span>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{current.name}</h2>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color }}>{current.sets} sets × {current.reps}</span>
          {isTimed && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color, background: `${color}18`, padding: '3px 10px', borderRadius: 99 }}>
              ⏱ Timed Hold
            </span>
          )}
        </div>

        <div style={{ background: `${color}10`, borderRadius: 'var(--radius)', padding: '24px 20px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 60 }}>{current.category === 'Stretch' ? '🧘' : current.category === 'Isometric' ? '🧱' : '💪'}</div>
          {current.videoURL && (
            <a href={current.videoURL} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--red)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              ▶ Watch video ↗
            </a>
          )}
        </div>

        <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Instructions</p>
        {current.instructions.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <span style={{ minWidth: 22, height: 22, borderRadius: '50%', background: `${color}18`, color, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <p style={{ fontSize: 13, lineHeight: 1.5 }}>{step}</p>
          </div>
        ))}

        <p style={{ fontSize: 14, fontWeight: 700, margin: '16px 0 8px' }}>Key Tips</p>
        {current.tips.slice(0, 3).map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
            <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{tip}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 20px 36px', borderTop: '1px solid var(--border)', background: 'white' }}>
        {isTimed ? (
          <button className="btn btn-primary" onClick={startHold} style={{ background: color }}>
            ⏱ Start {current.holdSeconds}s Timer
          </button>
        ) : (
          <button className="btn btn-primary" onClick={advanceAfterExercise}>
            {index >= exercises.length - 1 ? '🎉 Finish Session' : '✓ Done — Next Exercise →'}
          </button>
        )}
        {index > 0 && (
          <button onClick={() => { setIndex(i => i - 1); setCompleted(c => c.slice(0, -1)); setPhase('exercise') }}
            style={{ border: 'none', background: 'none', color: 'var(--text2)', fontSize: 14, cursor: 'pointer', width: '100%', padding: '10px 0 0' }}>
            ← Previous
          </button>
        )}
      </div>

      {showAbandon && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }}>
          <div style={{ background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 24px 48px', width: '100%' }}>
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

function CircleTimer({ seconds, total, color }) {
  const r = 80
  const circ = 2 * Math.PI * r
  const fill = total > 0 ? (seconds / total) * circ : 0

  return (
    <div className="timer-circle">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={color} strokeWidth="8"
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
