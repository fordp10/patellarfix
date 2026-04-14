import { useState } from 'react'
import { PHASES } from '../data/exercises'

const ACTIVITY_LABELS = {
  sedentary: 'Sedentary', lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active', very_active: 'Very Active', athlete: 'Athlete / Competitive',
}

const DURATION_LABELS = {
  less_than_2_weeks: '< 2 weeks', two_to_six_weeks: '2–6 weeks',
  one_to_three_months: '1–3 months', three_to_six_months: '3–6 months', more_than_six_months: '> 6 months',
}

const REFERENCES = [
  { title: 'Rio et al. (2015)', journal: 'British Journal of Sports Medicine', url: 'https://bjsm.bmj.com/content/49/19/1277' },
  { title: 'Kongsgaard et al. (2009)', journal: 'Scand J Med Sci Sports', url: 'https://pubmed.ncbi.nlm.nih.gov/19801400/' },
  { title: 'Purdam et al. (2004)', journal: 'British Journal of Sports Medicine', url: 'https://pubmed.ncbi.nlm.nih.gov/11385065/' },
  { title: 'Physio-pedia: Patellar Tendinopathy', journal: 'physio-pedia.com', url: 'https://www.physio-pedia.com/Patellar_Tendinopathy' },
]

export default function Settings({ store }) {
  const { profile, resetProgress, updateProfile } = store
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const phase = PHASES[profile.currentPhase]

  const startDate = profile.startDate ? new Date(profile.startDate).toLocaleDateString() : '—'

  return (
    <div>
      <div className="screen-header"><h1>Settings</h1></div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 32 }}>

        {/* Current phase */}
        <Section title="Current Phase">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 28 }}>{phase.icon}</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: phase.color }}>{phase.title}</p>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>{phase.description}</p>
            </div>
          </div>
        </Section>

        {/* Equipment */}
        <Section title="Equipment">
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>
            Select your training environment. Home workouts skip the leg press machine.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['home', 'gym'].map(type => (
              <button
                key={type}
                onClick={() => updateProfile({ equipmentType: type })}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 'var(--radius)',
                  border: `2px solid ${profile.equipmentType === type ? 'var(--blue)' : 'var(--border)'}`,
                  background: profile.equipmentType === type ? 'var(--blue)' : 'var(--card2)',
                  color: profile.equipmentType === type ? '#fff' : 'var(--text)',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}
              >
                {type === 'home' ? '🏠 Home' : '🏋️ Gym'}
              </button>
            ))}
          </div>
        </Section>

        {/* Program */}
        <Section title="Program Overview">
          <Row label="📅 Duration" value="12 weeks total" />
          <Row label="⏱️ Daily time" value="5–10 minutes" />
          <Row label="💪 Strength days" value="Mon, Wed, Fri" />
          <Row label="🧘 Stretch days" value="All other days" />
        </Section>

        {/* Your profile */}
        <Section title="Your Profile">
          <Row label="🩺 Initial pain" value={`${profile.painLevel}/10`} />
          <Row label="🏃 Activity level" value={ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel} />
          <Row label="📆 Symptom duration" value={DURATION_LABELS[profile.symptomDuration] || profile.symptomDuration} />
          <Row label="🗓️ Program start" value={startDate} />
        </Section>

        {/* Research references */}
        <Section title="Research References">
          {REFERENCES.map(ref => (
            <a key={ref.url} href={ref.url} target="_blank" rel="noreferrer" style={{ display: 'block', padding: '10px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{ref.title}</p>
              <p style={{ fontSize: 12, color: 'var(--blue)', marginTop: 2 }}>{ref.journal} ↗</p>
            </a>
          ))}
        </Section>

        {/* Disclaimer */}
        <Section title="Medical Disclaimer">
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            PatellarFix is for general wellness and educational purposes only. It is not intended to diagnose, treat, cure, or prevent any medical condition. Always consult a qualified physiotherapist or physician before starting a rehabilitation program, especially if you have severe pain or are unsure of your diagnosis.
          </p>
        </Section>

        {/* Reset */}
        <Section title="Data">
          {showResetConfirm ? (
            <div>
              <p style={{ fontSize: 14, color: 'var(--red)', marginBottom: 12, fontWeight: 600 }}>This will permanently delete all sessions, streak data, and return you to onboarding. Are you sure?</p>
              <button className="btn btn-danger btn-sm" onClick={() => { resetProgress(); setShowResetConfirm(false) }} style={{ marginBottom: 8 }}>Yes, Reset Everything</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowResetConfirm(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-danger btn-sm" onClick={() => setShowResetConfirm(true)}>🔄 Reset All Progress</button>
          )}
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="card">
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>{title}</p>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 14, color: 'var(--text2)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value}</span>
    </div>
  )
}
