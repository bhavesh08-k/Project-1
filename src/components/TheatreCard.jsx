import { getTheatreById } from '../data/theatres'
import Button from './Button'
import ShowtimeCard from './ShowtimeCard'

export default function TheatreCard({ theatreId, shows, selectedShowId, onSelectShow, onSelectSeats }) {
  const theatre = getTheatreById(theatreId)
  if (!theatre) return null
  const selectedHere = shows.some((s) => s.id === selectedShowId)

  return (
    <article className="theatre-card">
      <div className="theatre-top">
        <div>
          <h3 style={{ margin: 0 }}>{theatre.name}</h3>
          <p className="muted" style={{ margin: '4px 0 0' }}>
            {theatre.locality} · {theatre.amenities.join(' · ')}
          </p>
        </div>
        <span className="chip">{theatre.chain}</span>
      </div>
      <div className="show-row">
        {shows.map((show) => (
          <ShowtimeCard
            key={show.id}
            show={show}
            active={selectedShowId === show.id}
            onSelect={onSelectShow}
          />
        ))}
      </div>
      <Button style={{ marginTop: 14 }} disabled={!selectedHere} onClick={onSelectSeats}>
        Select seats
      </Button>
    </article>
  )
}
