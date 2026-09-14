import { createContext, useContext, useMemo, useState } from 'react'
import { DEFAULT_CITY } from '../data/locations'
import {
  clearStoredUser,
  getDraft,
  getStoredCity,
  getStoredUser,
  saveDraft,
  setStoredCity,
  setStoredUser,
} from '../utils/storage'

const AppContext = createContext(null)

const emptyDraft = {
  movieId: null,
  theatreId: null,
  showId: null,
  date: null,
  seats: [],
}

export function AppProvider({ children }) {
  const [city, setCityState] = useState(getStoredCity() || DEFAULT_CITY)
  const [user, setUser] = useState(getStoredUser())
  const [searchQuery, setSearchQuery] = useState('')
  const [draft, setDraftState] = useState(getDraft() || emptyDraft)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [reviewsVersion, setReviewsVersion] = useState(0)

  const triggerReviewsRefresh = () => {
    setReviewsVersion((v) => v + 1)
  }

  const setCity = (next) => {
    setCityState(next)
    setStoredCity(next)
  }

  const login = (profile) => {
    setUser(profile)
    setStoredUser(profile)
  }

  const logout = () => {
    setUser(null)
    clearStoredUser()
  }

  const updateDraft = (patch) => {
    setDraftState((prev) => {
      const next = { ...prev, ...patch }
      saveDraft(next)
      return next
    })
  }

  const resetDraft = () => {
    setDraftState(emptyDraft)
    saveDraft(emptyDraft)
  }

  const value = useMemo(
    () => ({
      city,
      setCity,
      user,
      login,
      logout,
      searchQuery,
      setSearchQuery,
      draft,
      updateDraft,
      resetDraft,
      loginModalOpen,
      setLoginModalOpen,
      reviewsVersion,
      triggerReviewsRefresh,
    }),
    [city, user, searchQuery, draft, loginModalOpen, reviewsVersion],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
