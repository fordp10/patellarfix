import { useState } from 'react'
import { determineStartingPhase } from '../data/exercises'

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Mostly sitting, little exercise', icon: '💻' },
  { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1–3 days/week', icon: '🚶' },
  { value: 'moderately_active', label: 'Moderately Active', desc: 'Moderate exercise 3–5 days/week', icon: '🏃' },
  { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6–7 days/week', icon: '⚡' },
  { value: 'athlete', label: 'Athlete / Competitive', desc: 'Competitive sports or intense daily training', icon: '🏅' },
]

const DURATION_OPTIONS = [
  { value: 'less_than_2_weeks', label: 'Less than 2 weeks' },
  { value: 'two_to_six_weeks', label: '2–6 weeks' },
  { value: 'one_to_three_months', label: '1–3 months' },
  { value: 'three_to_six_months', label: '3–6 months' },
  { value: 'more_than_six_months', label: 'More than 6 months' },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const [painLevel, setPainLevel] = useState(4)
  const [activityLevel, setActivityLevel] = useState('moderately_active')
  const [duration, setDuration] = useState('two_to_six_weeks')

  const handleComplete = () => {
    const phase = determineStartingPhase(painLevel, duration)
    onComplete(painLevel, activityLevel, duration, phase)
  }

  const PHASE_COLORS = { 1: '#F97316', 2: '#2563EB' }
  const assignedPhase = determineStartingPhase(painLevel, duration)

  return (
    <div className="overlay" style={{ background: '#fff' }}>
      {step === 0 && <WelcomeStep onNext={() => setStep(1)} />}
      {step === 1 && (
        <PainStep
          value={painLevel}
          onChange={setPainLevel}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <ActivityStep
          value={activityLevel}
          onChange={setActivityLevel}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          options={ACTIVITY_OPTIONS}
        />
      )}
      {step === 3 && (
        <DurationStep
          value={duration}
          onChange={setDuration}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          options={DURATION_OPTIONS}
        />
      )}
      {step === 4 && (
        <CompleteStep
          phase={assignedPhase}
          phaseColor={PHASE_COLORS[assignedPhase] || '#16A34A'}
          onStart={handleComplete}
        />
      )}
    </div>
  )
}

function WelcomeStep({ onNext }) {
  return (
    <div className="onboarding">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24 }}>
        <div style={{ fontSize: 80 }}>🦵</div>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>PatellarFix</h1>
          <p style={{ color: 'var(--text2)', marginTop: 8, fontSize: 17 }}>Recover smarter. Move better.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300, textAlign: 'left' }}>
          {[
            ['⏱️', '5–10 minutes per day'],
            ['🔬', 'Evidence-based protocols'],
            ['🔥', 'Streak tracking'],
            ['▶️', 'Video guides for every exercise'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ fontSize: 15, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--text3)', padding: '0 8px' }}>
          For general wellness only. Always consult a healthcare provider for medical advice.
        </p>
      </div>
      <button className="btn btn-primary" onClick={onNext}>Get Started →</button>
    </div>
  )
}

function StepHeader({ step, total, onBack, title, subtitle }) {
  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', padding: '4px 8px' }}>←</button>
        <div className="onboarding-dots">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`onboarding-dot ${i < step ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ width: 40 }} />
      </div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{title}</h2>
      {subtitle && <p style={{ color: 'var(--text2)', fontSize: 14 }}>{subtitle}</p>}
    </div>
  )
}

function PainStep({ value, onChange, onBack, onNext }) {
  const colors = ['#16A34A', '#65A30D', '#CA8A04', '#EA580C', '#DC2626', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#581C87', '#3B0764']
  const labels = ['No Pain', 'Minimal', 'Mild', 'Mild', 'Moderate', 'Moderate', 'Significant', 'Severe', 'Severe', 'Very Severe', 'Maximum']

  return (
    <div className="onboarding" style={{ gap: 20 }}>
      <StepHeader step={1} total={3} onBack={onBack} title="How is your pain right now?" subtitle="At rest or during everyday activities" />
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: 72, fontWeight: 800, color: colors[value], lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: colors[value], marginTop: 4 }}>{labels[value]}</div>
      </div>
      <div>
        <input type="range" min={0} max={10} step={1} value={value} onChange={e => onChange(Number(e.target.value))} style={{ '--accent': colors[value] }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>
          <span>No Pain</span><span>Worst Pain</span>
        </div>
      </div>
      <div className="card" style={{ background: 'var(--card2)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Reference</p>
        {[['0', '#16A34A', 'No pain'], ['1–3', '#CA8A04', 'Mild'], ['4–6', '#EA580C', 'Moderate'], ['7–9', '#DC2626', 'Severe'], ['10', '#7C3AED', 'Maximum']].map(([r, c, l]) => (
          <div key={r} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '3px 0' }}>
            <span style={{ color: c, fontWeight: 700, fontSize: 13, minWidth: 28 }}>{r}</span>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <button className="btn btn-primary" onClick={onNext}>Continue →</button>
    </div>
  )
}

function ActivityStep({ value, onChange, onBack, onNext, options }) {
  return (
    <div className="onboarding" style={{ gap: 16 }}>
      <StepHeader step={2} total={3} onBack={onBack} title="What's your activity level?" subtitle="Before your knee started bothering you" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(opt => (
          <button key={opt.value} className={`option-card ${value === opt.value ? 'selected' : ''}`} onClick={() => onChange(opt.value)}>
            <span style={{ fontSize: 26 }}>{opt.icon}</span>
            <div className="col flex-1">
              <span style={{ fontSize: 15, fontWeight: 600 }}>{opt.label}</span>
              <span style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{opt.desc}</span>
            </div>
            <span className="option-check">{value === opt.value ? '✅' : ''}</span>
          </button>
        ))}
      </div>
      <button className="btn btn-primary" onClick={onNext}>Continue →</button>
    </div>
  )
}

function DurationStep({ value, onChange, onBack, onNext, options }) {
  return (
    <div className="onboarding" style={{ gap: 16 }}>
      <StepHeader step={3} total={3} onBack={onBack} title="How long has your knee been hurting?" subtitle="This determines your starting protocol" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(opt => (
          <button key={opt.value} className={`option-card ${value === opt.value ? 'selected' : ''}`} onClick={() => onChange(opt.value)}>
            <span style={{ fontSize: 15, fontWeight: value === opt.value ? 700 : 400, flex: 1 }}>{opt.label}</span>
            <span className="option-check">{value === opt.value ? '✅' : ''}</span>
          </button>
        ))}
        <div className="card mt-8" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
          <p style={{ fontSize: 13, color: '#92400E' }}>
            💡 Chronic tendinopathy (&gt;3 months) responds best to heavier loading. Recent pain needs isometrics first to calm the tendon.
          </p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onNext}>Continue →</button>
    </div>
  )
}

function CompleteStep({ phase, phaseColor, onStart }) {
  const phaseNames = { 1: 'Phase 1: Pain Relief', 2: 'Phase 2: Strength Building', 3: 'Phase 3: Full Recovery' }
  const phaseDescs = {
    1: 'Starting with isometric holds to reduce pain and safely load your tendon (Rio et al., 2015).',
    2: 'Starting with Heavy Slow Resistance training for long-term tendon rebuilding (Kongsgaard et al., 2009).',
    3: 'Starting with progressive functional loading to return you to full activity.',
  }

  return (
    <div className="onboarding" style={{ justifyContent: 'center', gap: 24, textAlign: 'center' }}>
      <div style={{ flex: 1 }} />
      <div style={{ fontSize: 72 }}>✅</div>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 800 }}>Your plan is ready</h2>
        <p style={{ color: 'var(--text2)', marginTop: 8, fontSize: 15 }}>Based on your answers, we've set the right starting point.</p>
      </div>
      <div className="card" style={{ borderLeft: `4px solid ${phaseColor}`, textAlign: 'left' }}>
        <p style={{ fontWeight: 700, fontSize: 16, color: phaseColor }}>{phaseNames[phase]}</p>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 6 }}>{phaseDescs[phase]}</p>
      </div>
      <div className="card" style={{ background: 'var(--card2)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', gap: 0 }}>
        {[['5–10', 'min/day'], ['3×', 'per week'], ['12', 'weeks']].map(([v, u]) => (
          <div key={u}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{u}</div>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }} />
      <button className="btn btn-primary" onClick={onStart} style={{ background: phaseColor }}>Start My Recovery 💪</button>
    </div>
  )
}
