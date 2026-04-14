import { useState } from 'react'
import { getSessionType, getSessionExercises } from '../data/exercises'
import ExerciseDetail from './ExerciseDetail'

export default function TodayWorkout({ store, onStartSession }) {
  const { profile, isTodayComplete, todaySession } = store
  const sessionType = getSessionType()
  const exercises = getSessionExercises(profile.currentPhase, sessionType, profile.equipmentType)
  const [selectedEx, setSelectedEx] = useState(null)

  const isFullDay = sessionType === 'full'
  const completedIds = todaySession?.completedExerciseIds ?? []

  return (
    <div>
      <div className="screen-header">
        <h1>Today</h1>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Session type header */}
        <div className="card row" style={{ gap: 12 }}>
          <span style={{ fontSize: 28 }}>{isFullDay ? '💪' : '🧘'}</span>
          <div className="flex-1">
            <p style={{ fontWeight: 700, fontSize: 15 }}>{isFullDay ? 'Full Session' : 'Stretch Only'}</p>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>{exercises.length} exercises · ~{Math.round(exercises.reduce((s, e) => s + e.estimatedMinutes, 0))} min</p>
          </div>
          <span className={`badge ${isFullDay ? 'badge-blue' : 'badge-green'}`}>
            {isFullDay ? 'Strength + Stretch' : 'Stretch'}
          </span>
        </div>

        {/* Exercise list */}
        <div>
          {exercises.map((ex, i) => {
            const done = completedIds.includes(ex.id)
            return (
              <button key={ex.id} className="exercise-row" onClick={() => setSelectedEx(ex)}>
                <div className={`ex-num ${done ? 'done' : ''}`}>{done ? '✓' : i + 1}</div>
                <div className="ex-info">
                  <div className="ex-name" style={{ opacity: done ? 0.6 : 1 }}>{ex.name}</div>
                  <div className="ex-meta">{ex.sets} sets × {ex.reps} · {ex.category}</div>
                </div>
                <span style={{ color: 'var(--text3)', fontSize: 14 }}>›</span>
              </button>
            )
          })}
        </div>

        {/* CTA */}
        {isTodayComplete ? (
          <div className="complete-banner">
            <p style={{ fontSize: 28, marginBottom: 6 }}>🎉</p>
            <p style={{ fontWeight: 700, color: 'var(--green)', fontSize: 16 }}>Session Complete!</p>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Great work. Rest up and come back tomorrow.</p>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onStartSession}>▶ Start Session</button>
        )}
      </div>

      {selectedEx && <ExerciseDetail exercise={selectedEx} onClose={() => setSelectedEx(null)} />}
    </div>
  )
}
