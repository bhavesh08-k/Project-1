const KEYS = {
  bookings: 'noirbox_bookings',
  occupied: 'noirbox_occupied',
  draft: 'noirbox_draft',
  city: 'noirbox_city',
  user: 'noirbox_user',
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
