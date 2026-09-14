import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../utils/bookingUtils'
import { calculateMovieVerdict, getMovieReviews } from '../utils/storage'
import { useApp } from '../context/AppContext'

export default function MovieCard({ movie }) {
  const { reviewsVersion } = useApp()

  const verdictData = useMemo(() => {
    const reviews = getMovieReviews(movie.id, reviewsVersion)
    return calculateMovieVerdict(reviews, movie.rating)
  }, [movie.id, movie.rating, reviewsVersion])

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <div className="poster-wrap">
        <img src={movie.poster} alt={movie.title} />
        {movie.rating > 0 ? (
          <span className="rating-badge">★ {verdictData.avgRating}</span>
        ) : (
          <span className="rating-badge">Soon</span>
        )}
        {movie.status === 'now-showing' && verdictData.recommendPercent > 0 && (
          <span className="recommend-badge" title="Audience Recommendation Rate">
            {verdictData.verdictBadge.emoji} {verdictData.recommendPercent}%
          </span>
        )}
      </div>
      <div className="card-body">
        <h3>{movie.title}</h3>
        <div className="card-meta">
          {movie.genres.join(' / ')} · {movie.language}
        </div>
        {movie.status === 'now-showing' ? (
          <div className="card-footer-row">
            <span className="card-price">From {formatINR(220)}</span>
            <span className="card-verdict-text">{verdictData.verdictBadge.label}</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}
