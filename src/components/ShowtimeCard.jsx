import { formatINR } from '../utils/bookingUtils'

export default function ShowtimeCard({ show, active, onSelect }) {
  return (
    <button
      type="button"
      className={`showtime ${active ? 'active' : ''}`}
      onClick={() => onSelect(show)}
    >
      {show.time}
      <small>
        {show.format} · {formatINR(show.price)}
      </small>
    </button>
  )
}
