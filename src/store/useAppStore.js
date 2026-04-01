import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'patellarfix_v1'

const defaultState = {
  profile: {
    painLevel: 5,
    activityLevel: 'moderately_active',
    symptomDuration: 'two_to_six_weeks',
    onboardingComplete: false,
    startDate: null,
    currentPhase: 1,
  },
  sessions: [],
}

function isSameDay(a, b) {
  const da = new Date(a), db = new Date(b)
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
}

function calculateStreak(sessions) {
  const completed = sessions
    .filter(s => s.isComplete)
    .map(s => new Date(s.date))
    .sort((a, b) => b - a)

  if (completed.length === 0) return 0

  let streak = 0
  let checkDate = new Date()
  checkDate.setHours(0, 0, 0, 0)

  // If today isn't done, start counting from yesterday
  const todayDone = completed.some(d => isSameDay(d, checkDate))
  if (!todayDone) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  for (let i = 0; i < 365; i++) {
    const found = completed.some(d => isSameDay(d, checkDate))
    if (found) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

function calculateLongestStreak(sessions) {
  const completed = sessions
    .filter(s => s.isComplete)
    .map(s => {
      const d = new Date(s.date)
      d.setHours(0, 0, 0, 0)
      return d
    })
    .sort((a, b) => a - b)

  if (completed.length === 0) return 0

  let longest = 1, current = 1
  for (let i = 1; i < completed.length; i++) {
    const diff = (completed[i] - completed[i - 1]) / 86400000
    if (diff === 1) {
      current++
      longest = Math.max(longest, current)
    } else if (diff > 1) {
      current = 1
    }
  }
  return longest
}

export function useAppStore() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
    } catch {
      return defaultState
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const updateProfile = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }))
  }, [])

  const completeOnboarding = useCallback((painLevel, activityLevel, symptomDuration, phase) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        painLevel,
        activityLevel,
        symptomDuration,
        currentPhase: phase,
        onboardingComplete: true,
        startDate: new Date().toISOString(),
      },
    }))
  }, [])

  const saveSession = useCallback((session) => {
    setState(prev => {
      const filtered = prev.sessions.filter(s => !isSameDay(new Date(s.date), new Date()))
      return { ...prev, sessions: [...filtered, session] }
    })
  }, [])

  const checkPhaseAdvancement = useCallback((sessions) => {
    setState(prev => {
      const startDate = prev.profile.startDate ? new Date(prev.profile.startDate) : new Date()
      const msPerWeek = 7 * 24 * 60 * 60 * 1000
      const weeksElapsed = Math.floor((Date.now() - startDate) / msPerWeek)
      const fullSessions = sessions.filter(s => s.isComplete && s.sessionType === 'full').length

      let newPhase = prev.profile.currentPhase
      if (prev.profile.currentPhase === 1 && weeksElapsed >= 2 && fullSessions >= 4) {
        newPhase = 2
      } else if (prev.profile.currentPhase === 2 && weeksElapsed >= 8 && fullSessions >= 16) {
        newPhase = 3
      }

      if (newPhase !== prev.profile.currentPhase) {
        return { ...prev, profile: { ...prev.profile, currentPhase: newPhase } }
      }
      return prev
    })
  }, [])

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(defaultState)
  }, [])

  const todaySession = state.sessions.find(s => isSameDay(new Date(s.date), new Date()))
  const isTodayComplete = todaySession?.isComplete ?? false
  const currentStreak = calculateStreak(state.sessions)
  const longestStreak = calculateLongestStreak(state.sessions)
  const totalCompleted = state.sessions.filter(s => s.isComplete).length

  const hasCompletedOn = useCallback((date) => {
    return state.sessions.some(s => isSameDay(new Date(s.date), date) && s.isComplete)
  }, [state.sessions])

  return {
    profile: state.profile,
    sessions: state.sessions,
    todaySession,
    isTodayComplete,
    currentStreak,
    longestStreak,
    totalCompleted,
    updateProfile,
    completeOnboarding,
    saveSession,
    checkPhaseAdvancement,
    resetProgress,
    hasCompletedOn,
  }
}
