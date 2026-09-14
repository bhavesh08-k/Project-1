import { DEFAULT_REVIEWS } from '../data/reviews'

const KEYS = {
  bookings: 'noirbox_bookings',
  occupied: 'noirbox_occupied',
  draft: 'noirbox_draft',
  city: 'noirbox_city',
  user: 'noirbox_user',
  reviews: 'noirbox_user_reviews',
  votes: 'noirbox_review_votes',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getBookings() {
  return read(KEYS.bookings, [])
}

export function saveBooking(booking) {
  const all = getBookings()
  all.unshift(booking)
  write(KEYS.bookings, all)
  return booking
}

export function getBookingById(id) {
  return getBookings().find((b) => b.id === id) ?? null
}

export function getOccupiedMap() {
  return read(KEYS.occupied, {})
}

export function markSeatsOccupied(showId, seats) {
  const map = getOccupiedMap()
  const current = new Set(map[showId] ?? [])
  seats.forEach((seat) => current.add(seat))
  map[showId] = [...current]
  write(KEYS.occupied, map)
}

export function getUserOccupied(showId) {
  return getOccupiedMap()[showId] ?? []
}

export function getDraft() {
  return read(KEYS.draft, null)
}

export function saveDraft(draft) {
  write(KEYS.draft, draft)
}

export function clearDraft() {
  localStorage.removeItem(KEYS.draft)
}

export function getStoredCity() {
  return localStorage.getItem(KEYS.city)
}

export function setStoredCity(city) {
  localStorage.setItem(KEYS.city, city)
}

export function getStoredUser() {
  return read(KEYS.user, null)
}

export function setStoredUser(user) {
  write(KEYS.user, user)
}

export function clearStoredUser() {
  localStorage.removeItem(KEYS.user)
}

// ----------------------------------------------------
// Review System Utilities (Moctale-inspired)
// ----------------------------------------------------

export function getUserCustomReviews() {
  return read(KEYS.reviews, [])
}

export function getAllReviews() {
  const userCustom = getUserCustomReviews()
  // Combine custom reviews with default pre-seeded reviews
  return [...userCustom, ...DEFAULT_REVIEWS]
}

export function getMovieReviews(movieId) {
  return getAllReviews().filter((r) => r.movieId === movieId)
}

export function saveUserReview(reviewData) {
  const custom = getUserCustomReviews()
  const newReview = {
    id: `rev-user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    likes: 0,
    date: new Date().toISOString().split('T')[0],
    verifiedBooking: true,
    ...reviewData,
  }
  custom.unshift(newReview)
  write(KEYS.reviews, custom)
  return newReview
}

export function deleteUserReview(reviewId) {
  const custom = getUserCustomReviews().filter((r) => r.id !== reviewId)
  write(KEYS.reviews, custom)
}

export function getUserVotedReviewIds() {
  return read(KEYS.votes, [])
}

export function toggleReviewHelpful(reviewId) {
  const votedIds = new Set(getUserVotedReviewIds())
  const hasVoted = votedIds.has(reviewId)
  let diff = 0

  if (hasVoted) {
    votedIds.delete(reviewId)
    diff = -1
  } else {
    votedIds.add(reviewId)
    diff = 1
  }

  write(KEYS.votes, [...votedIds])

  // Also update like count in custom reviews if it's a custom review
  const custom = getUserCustomReviews()
  const updatedCustom = custom.map((r) => {
    if (r.id === reviewId) {
      return { ...r, likes: Math.max(0, (r.likes || 0) + diff) }
    }
    return r
  })
  write(KEYS.reviews, updatedCustom)

  return { hasVoted: !hasVoted, diff }
}

// Decision Engine: Computes Moctale-style audience verdict, recommend %, and distribution
export function calculateMovieVerdict(reviews, baselineScore = 8.0) {
  if (!reviews || reviews.length === 0) {
    return {
      totalCount: 0,
      avgRating: baselineScore,
      recommendPercent: 85,
      verdictBadge: {
        label: 'Must Watch in Theatres',
        emoji: '🏆',
        type: 'must-watch',
      },
      distribution: { '9-10': 60, '7-8': 30, '5-6': 8, '3-4': 2, '1-2': 0 },
      topTags: ['Cinematography', 'Sound Design', 'Acting'],
    }
  }

  const totalCount = reviews.length
  const totalScore = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0)
  const avgRating = Number((totalScore / totalCount).toFixed(1))

  // Recommended count: verdict is 'must-watch' or 'worth-it' or rating >= 7
  const recommendedCount = reviews.filter(
    (r) => r.verdict === 'must-watch' || r.verdict === 'worth-it' || r.rating >= 7,
  ).length
  const recommendPercent = Math.round((recommendedCount / totalCount) * 100)

  // Verdict determination
  let verdictBadge = {
    label: 'Worth a Watch',
    emoji: '🎟️',
    type: 'worth-it',
  }

  if (recommendPercent >= 75 && avgRating >= 7.6) {
    verdictBadge = {
      label: 'Must Watch in Theatres',
      emoji: '🏆',
      type: 'must-watch',
    }
  } else if (recommendPercent < 55 || avgRating < 6.0) {
    verdictBadge = {
      label: 'Mixed · Wait for OTT',
      emoji: '🛋️',
      type: 'skip',
    }
  }

  // Rating distribution
  const distCounts = { '9-10': 0, '7-8': 0, '5-6': 0, '3-4': 0, '1-2': 0 }
  reviews.forEach((r) => {
    const score = Number(r.rating)
    if (score >= 9) distCounts['9-10'] += 1
    else if (score >= 7) distCounts['7-8'] += 1
    else if (score >= 5) distCounts['5-6'] += 1
    else if (score >= 3) distCounts['3-4'] += 1
    else distCounts['1-2'] += 1
  })

  // Tag frequency
  const tagCounts = {}
  reviews.forEach((r) => {
    ;(r.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1
    })
  })
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t)

  return {
    totalCount,
    avgRating,
    recommendPercent,
    verdictBadge,
    distribution: distCounts,
    topTags: topTags.length > 0 ? topTags : ['Great Visuals', 'Performances'],
  }
}
