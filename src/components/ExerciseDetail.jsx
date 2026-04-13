export default function ExerciseDetail({ exercise, onClose }) {
  const catColors = { Isometric: '#F97316', Strength: '#2563EB', Stretch: '#16A34A' }
  const color = catColors[exercise.category] || '#2563EB'

  return (
    <div className="overlay">
      {/* Header */}
      <div style={{ padding: '16px 20px', position: 'sticky', top: 0, background: 'white', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} style={{ border: 'none', background: 'var(--card2)', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer' }}>←</button>
        <h2 style={{ fontSize: 17, fontWeight: 700, flex: 1 }}>{exercise.name}</h2>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Meta */}
        <div>
          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: `${color}18`, color, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{exercise.category}</span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <Pill icon="🔁" text={`${exercise.sets} sets × ${exercise.reps}`} />
            <Pill icon="⏸️" text={`Rest ${exercise.restSeconds}s`} />
            <Pill icon="⏱️" text={`~${exercise.estimatedMinutes} min`} />
          </div>
        </div>

        {/* Visual placeholder */}
        <div style={{ background: `${color}10`, borderRadius: 'var(--radius)', padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 64 }}>{exercise.category === 'Stretch' ? '🧘' : exercise.category === 'Isometric' ? '🧱' : '💪'}</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 8 }}>See video guide below</p>
        </div>

        {/* Instructions */}
        <Section title="📋 Instructions">
          {exercise.instructions.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <span style={{ minWidth: 24, height: 24, borderRadius: '50%', background: `${color}18`, color, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>{step}</p>
            </div>
          ))}
        </Section>

        {/* Tips */}
        <Section title="💡 Tips & Science">
          {exercise.tips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{tip}</p>
            </div>
          ))}
        </Section>

        {/* Links */}
        <Section title="🔗 Resources">
          {exercise.videoURL && (
            <a href={exercise.videoURL} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--card2)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>▶️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Watch Video Guide</p>
                <p style={{ fontSize: 12, color: 'var(--text2)' }}>Opens on YouTube</p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--text3)' }}>↗</span>
            </a>
          )}
          {exercise.referenceURL && (
            <a href={exercise.referenceURL} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--card2)', borderRadius: 'var(--radius-sm)', textDecoration: 'none' }}>
              <span style={{ fontSize: 24 }}>📄</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{exercise.referenceLabel}</p>
                <p style={{ fontSize: 12, color: 'var(--text2)' }}>View research source</p>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--text3)' }}>↗</span>
            </a>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{title}</p>
      {children}
    </div>
  )
}

function Pill({ icon, text }) {
  return (
    <span style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 4, alignItems: 'center' }}>
      {icon} {text}
    </span>
  )
}
