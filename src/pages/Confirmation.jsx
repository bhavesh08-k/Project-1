import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import TicketGraphic from '../components/TicketGraphic'
import { getMovieById } from '../data/movies'
import { getTheatreById } from '../data/theatres'
import { formatINR, formatLongDate } from '../utils/bookingUtils'
import { getBookingById } from '../utils/storage'

export default function Confirmation() {
  const { bookingId } = useParams()
  const booking = getBookingById(bookingId)

  if (!booking) {
    return (
      <EmptyState
        title="Booking not found"
        message="This confirmation lives in localStorage on this browser only."
        to="/bookings"
        cta="My bookings"
      />
    )
  }

  const movie = getMovieById(booking.movieId)
  const theatre = getTheatreById(booking.theatreId)

  return (
    <section className="section container">
      <p className="kicker" style={{ textAlign: 'center' }}>
        Payment successful · demo
      </p>
      <h1 className="page-title" style={{ textAlign: 'center' }}>
        You’re in.
      </h1>
      <div className="ticket">
        <div className="ticket-hero" style={{ backgroundImage: `url(${movie?.backdrop})` }} />
        <div className="ticket-body">
          <p className="muted">Booking ID</p>
          <h2>{booking.id}</h2>
          <h3>{movie?.title}</h3>
          <p>
            {theatre?.name}
            <br />
            {formatLongDate(booking.date)} · {booking.time} · {booking.format}
          </p>
          <p>Seats {booking.seats.join(', ')}</p>
          <p>Total {formatINR(booking.total)} · {booking.method}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: 16 }}>
            <TicketGraphic bookingId={booking.id} />
            <span className="muted">NOIRBOX demo ticket</span>
          </div>
        </div>
      </div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          Download ticket
        </button>
        <Link to="/" className="btn btn-ghost">
          Back to home
        </Link>
      </div>
    </section>
  )
}
