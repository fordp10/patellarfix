import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import Onboarding from './components/Onboarding'
import Home from './components/Home'
import TodayWorkout from './components/TodayWorkout'
import Progress from './components/Progress'
import Settings from './components/Settings'
import SessionMode from './components/SessionMode'

const TABS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'today', label: 'Today', icon: BoltIcon },
  { id: 'progress', label: 'Progress', icon: ChartIcon },
  { id: 'settings', label: 'Settings', icon: GearIcon },
]

export default function App() {
  const store = useAppStore()
  const [activeTab, setActiveTab] = useState('home')
  const [showSession, setShowSession] = useState(false)
  const [showPwaBanner, setShowPwaBanner] = useState(false)

  // Show "Add to Home Screen" hint on iOS Safari if not already installed
  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    const dismissed = localStorage.getItem('pf_pwa_dismissed')
    if (isIOS && !isStandalone && !dismissed) {
      setTimeout(() => setShowPwaBanner(true), 2000)
    }
  }, [])

  const dismissPwaBanner = () => {
    localStorage.setItem('pf_pwa_dismissed', '1')
    setShowPwaBanner(false)
  }

  if (!store.profile.onboardingComplete) {
    return <Onboarding onComplete={store.completeOnboarding} />
  }

  const handleStartSession = () => {
    setShowSession(true)
    setActiveTab('home')
  }

  return (
    <div className="app">
      {showSession && (
        <SessionMode store={store} onClose={() => setShowSession(false)} />
      )}

      <div className="screen-content">
        {showPwaBanner && (
          <div className="pwa-banner">
            <span>📲</span>
            <span>Add to Home Screen: tap <strong>Share</strong> → <strong>Add to Home Screen</strong></span>
            <button className="pwa-banner-dismiss" onClick={dismissPwaBanner}>×</button>
          </div>
        )}

        {activeTab === 'home' && <Home store={store} onStartSession={handleStartSession} />}
        {activeTab === 'today' && <TodayWorkout store={store} onStartSession={handleStartSession} />}
        {activeTab === 'progress' && <Progress store={store} />}
        {activeTab === 'settings' && <Settings store={store} />}
      </div>

      <nav className="tab-bar">
        {TABS.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <tab.icon />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// ── SVG Tab Icons ──────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v11h3v9l7-12h-4l4-8z" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 20h2v-8H5v8zm4 0h2V4H9v16zm4 0h2v-4h-2v4zm4 0h2v-12h-2v12z" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54a7.36 7.36 0 0 0-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z" />
    </svg>
  )
}
