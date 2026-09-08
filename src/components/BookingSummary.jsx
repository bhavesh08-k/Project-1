import { formatINR } from '../utils/bookingUtils'

export default function BookingSummary({
  movie,
  theatre,
  show,
  seats,
  breakdown,
  action,
}) {
  return (
    <aside className="panel">
      <p className="kicker">Booking summary</p>
      <h3 style={{ marginTop: 6 }}>{movie?.title ?? 'Select a movie'}</h3>
      {theatre ? <p className="muted">{theatre.name}</p> : null}
      {show ? (
        <p className="muted">
          {show.date} · {show.time} · {show.format}
        </p>
      ) : null}
      <p>
        Seats: {seats.length ? seats.join(', ') : 'None selected'}
      </p>
      {breakdown ? (
        <>
          <div className="summary-row">
            <span>Tickets ({breakdown.count})</span>
            <span>{formatINR(breakdown.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Convenience fee</span>
            <span>{formatINR(breakdown.convenienceFee)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatINR(breakdown.total)}</span>
          </div>
        </>
      ) : null}
      {action}
    </aside>
  )
}
