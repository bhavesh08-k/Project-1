import { Link } from 'react-router-dom'
import { formatINR } from '../utils/bookingUtils'

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="poster-wrap">
        <img src={movie.poster} alt={movie.title} />
        {movie.rating > 0 ? <span className="rating-badge">★ {movie.rating}</span> : <span className="rating-badge">Soon</span>}
      </div>
      <div className="card-body">
        <h3>{movie.title}</h3>
        <div className="card-meta">
          {movie.genres.join(' / ')} · {movie.language}
        </div>
        {movie.status === 'now-showing' ? (
          <div className="card-meta" style={{ marginTop: 6, color: 'var(--gold)' }}>
            From {formatINR(220)}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
