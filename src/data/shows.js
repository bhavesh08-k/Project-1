import { getNowShowing } from './movies'
import { theatres } from './theatres'

const TIME_SLOTS = [
  { time: '10:15 AM', format: '2D' },
  { time: '01:40 PM', format: '2D' },
  { time: '04:20 PM', format: '3D' },
  { time: '07:30 PM', format: '2D' },
  { time: '10:10 PM', format: 'IMAX' },
]

const BASE_PRICES = {
  '2D': 220,
  '3D': 280,
  IMAX: 420,
  '4DX': 390,
  Luxe: 480,
  Gold: 520,
}

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function formatDateISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getBookingDates(days = 5) {
  const dates = []
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push({
      iso: formatDateISO(d),
      label: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      day: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
    })
  }
  return dates
}

function movieTheatres(movieId) {
  const n = theatres.length
  const start = hash(movieId) % n
  const count = 3 + (hash(movieId + 't') % 2)
  const list = []
  for (let i = 0; i < count; i += 1) {
    list.push(theatres[(start + i * 2) % n])
  }
  return list
}

function buildShows() {
  const dates = getBookingDates(5).map((d) => d.iso)
  const nowShowing = getNowShowing()
  const shows = []

  nowShowing.forEach((movie) => {
    movieTheatres(movie.id).forEach((theatre) => {
      dates.forEach((date) => {
        const slotCount = 3 + (hash(movie.id + theatre.id + date) % 3)
        TIME_SLOTS.slice(0, slotCount).forEach((slot) => {
          let format = slot.format
          if (format === 'IMAX' && !theatre.screens.includes('IMAX')) {
            format = theatre.screens.includes('3D') ? '3D' : '2D'
          }
          if (format === '3D' && !theatre.screens.includes('3D')) {
            format = theatre.screens[0] === 'Gold' ? 'Gold' : '2D'
          }
          const id = `${movie.id}__${theatre.id}__${date}__${slot.time.replace(/\s/g, '')}`
          const jitter = (hash(id) % 40) - 10
          shows.push({
            id,
            movieId: movie.id,
            theatreId: theatre.id,
            city: theatre.city,
            date,
            time: slot.time,
            format,
            language: movie.language,
            price: Math.max(180, (BASE_PRICES[format] ?? 240) + jitter),
          })
        })
      })
    })
  })

  return shows
}

export const shows = buildShows()

export function getShowById(id) {
  return shows.find((s) => s.id === id) ?? null
}

export function getShowsForMovie(movieId, city, date) {
  return shows.filter(
    (s) =>
      s.movieId === movieId &&
      (!city || s.city === city) &&
      (!date || s.date === date),
  )
}

export { BASE_PRICES }
