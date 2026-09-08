import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import TicketGraphic from '../components/TicketGraphic'
import { getMovieById } from '../data/movies'
import { getTheatreById } from '../data/theatres'
import { formatINR, formatLongDate } from '../utils/bookingUtils'
import { getBookings } from '../utils/storage'

export default function MyBookings() {
  const bookings = useMemo(() => getBookings(), [])
  const [active, setActive] = useState(null)

  if (!bookings.length) {
    return (
      <section className="section container">
        <EmptyState
          title="No bookings yet"
          message="Book a demo show and it will appear here, saved in localStorage."
          to="/movies"
          cta="Browse movies"
        />
      </section>
    )
  }

  const selected = bookings.find((b) => b.id === active)

  return (
    <section className="section container">
      <h1 className="page-title">My bookings</h1>
      <p className="muted">Stored locally on this device. Clearing site data will remove them.</p>
      <div className="theatre-list" style={{ marginTop: 24 }}>
        {bookings.map((booking) => {
          const movie = getMovieById(booking.movieId)
          const theatre = getTheatreById(booking.theatreId)
          return (
            <article key={booking.id} className="booking-card">
              <div className="theatre-top">
                <div>
                  <h3 style={{ margin: 0 }}>{movie?.title}</h3>
                  <p className="muted">
                    {theatre?.name} · {formatLongDate(booking.date)} · {booking.time}
                  </p>
                  <p>Seats {booking.seats.join(', ')} · {formatINR(booking.total)}</p>
                  <p className="muted">{booking.id}</p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => setActive(booking.id)}>
                  View ticket
                </button>
              </div>
            </article>
          )
        })}
      </div>
      {selected ? (
        <div className="modal-backdrop" onClick={() => setActive(null)} role="presentation">
          <div className="ticket" onClick={(e) => e.stopPropagation()} style={{ width: 'min(520px, 100%)' }}>
            <div
              className="ticket-hero"
              style={{ backgroundImage: `url(${getMovieById(selected.movieId)?.backdrop})` }}
            />
            <div className="ticket-body">
              <h2>{selected.id}</h2>
              <h3>{getMovieById(selected.movieId)?.title}</h3>
              <p>
                {getTheatreById(selected.theatreId)?.name}
                <br />
                {formatLongDate(selected.date)} · {selected.time}
              </p>
              <p>Seats {selected.seats.join(', ')}</p>
              <TicketGraphic bookingId={selected.id} />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }} className="no-print">
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  Download ticket
                </button>
                <Link to={`/confirmation/${selected.id}`} className="btn btn-ghost">
                  Open page
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
