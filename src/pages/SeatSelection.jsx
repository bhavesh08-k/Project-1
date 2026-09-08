import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BookingSummary from '../components/BookingSummary'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import SeatMap from '../components/SeatMap'
import { useApp } from '../context/AppContext'
import { getMovieById } from '../data/movies'
import { getShowById } from '../data/shows'
import { getTheatreById } from '../data/theatres'
import { getGeneratedOccupied, priceBreakdown } from '../utils/bookingUtils'
import { getUserOccupied } from '../utils/storage'

export default function SeatSelection() {
  const { showId } = useParams()
  const show = getShowById(showId)
  const { draft, updateDraft } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!show) return
    if (draft.showId !== show.id) {
      updateDraft({
        movieId: show.movieId,
        theatreId: show.theatreId,
        showId: show.id,
        date: show.date,
        seats: [],
      })
    }
  }, [show, draft.showId, updateDraft])

  const occupied = useMemo(() => {
    if (!show) return new Set()
    return new Set([...getGeneratedOccupied(show.id), ...getUserOccupied(show.id)])
  }, [show])

  if (!show) {
    return <EmptyState title="Show not found" message="This showtime is no longer available." to="/movies" cta="Browse movies" />
  }

  const movie = getMovieById(show.movieId)
  const theatre = getTheatreById(show.theatreId)
  const selected = draft.showId === show.id ? draft.seats : []
  const breakdown = priceBreakdown(show, selected)

  const toggle = (seatId) => {
    const next = selected.includes(seatId)
      ? selected.filter((id) => id !== seatId)
      : [...selected, seatId].sort()
    updateDraft({
      movieId: show.movieId,
      theatreId: show.theatreId,
      showId: show.id,
      date: show.date,
      seats: next,
    })
  }

  return (
    <section className="section container">
      <p className="kicker">{theatre?.name}</p>
      <h1 className="page-title">Select seats</h1>
      <p className="muted">
        {movie?.title} · {show.date} · {show.time} · {show.format}
      </p>
      <div className="seat-layout">
        <div className="panel">
          <SeatMap occupied={occupied} selected={selected} onToggle={toggle} />
        </div>
        <BookingSummary
          movie={movie}
          theatre={theatre}
          show={show}
          seats={selected}
          breakdown={breakdown}
          action={
            <>
              {selected.length === 0 ? <p className="error">Select at least one available seat to continue.</p> : null}
              <Button
                style={{ width: '100%', marginTop: 12 }}
                disabled={selected.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed to checkout
              </Button>
            </>
          }
        />
      </div>
    </section>
  )
}
