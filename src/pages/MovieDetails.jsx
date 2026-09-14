import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import MovieReviewsSection from '../components/Reviews/MovieReviewsSection'
import TrailerModal from '../components/TrailerModal'
import { useApp } from '../context/AppContext'
import { getMovieById } from '../data/movies'
import { getShowsForMovie } from '../data/shows'
import { getTheatreById } from '../data/theatres'
import { formatDuration } from '../utils/bookingUtils'
import { calculateMovieVerdict, getMovieReviews } from '../utils/storage'

export default function MovieDetails() {
  const { movieId } = useParams()
  const movie = getMovieById(movieId)
  const { city, updateDraft, reviewsVersion } = useApp()
  const [trailer, setTrailer] = useState(false)
  const navigate = useNavigate()

  // Reviews for this movie
  const reviews = useMemo(() => {
    return movie ? getMovieReviews(movie.id, reviewsVersion) : []
  }, [movie, reviewsVersion])

  const verdictData = useMemo(() => {
    return calculateMovieVerdict(reviews, movie?.rating)
  }, [reviews, movie])

  if (!movie) {
    return (
      <EmptyState
        title="Movie not found"
        message="This title is not in the demo catalogue."
        to="/movies"
        cta="Browse movies"
      />
    )
  }

  const cityShows = getShowsForMovie(movie.id, city)
  const theatreCount = new Set(cityShows.map((s) => s.theatreId)).size
  const canBook = movie.status === 'now-showing' && cityShows.length > 0

  const book = () => {
    updateDraft({ movieId: movie.id, seats: [] })
    navigate(`/movies/${movie.id}/showtimes`)
  }

  const scrollToReviews = () => {
    const el = document.getElementById('reviews')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="movie-details-page">
      <section className="container details">
        <div className="details-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
        <div>
          <p className="kicker">
            {movie.status === 'now-showing' ? 'Now showing' : 'Coming soon'}
          </p>
          <h1 className="page-title">{movie.title}</h1>
          <p className="muted">{movie.tagline}</p>

          <div className="meta-row">
            {movie.rating > 0 ? (
              <span className="chip" style={{ color: 'var(--gold)' }}>
                ★ {verdictData.avgRating}
              </span>
            ) : (
              <span className="chip">Unrated</span>
            )}
            <button
              type="button"
              className="chip chip-verdict-jump"
              onClick={scrollToReviews}
              title="Click to view audience reviews"
            >
              {verdictData.verdictBadge.emoji} {verdictData.recommendPercent}% Recommend · {verdictData.totalCount} reviews
            </button>
            {movie.genres.map((g) => (
              <span className="chip" key={g}>
                {g}
              </span>
            ))}
            <span className="chip">{movie.language}</span>
            <span className="chip">{formatDuration(movie.duration)}</span>
            <span className="chip">{movie.certification}</span>
          </div>

          <p>
            <strong>Release</strong> · {movie.releaseDate} &nbsp;|&nbsp;{' '}
            <strong>Director</strong> · {movie.director}
          </p>
          <p>{movie.description}</p>

          <h3>Cast</h3>
          <div className="cast-list">
            {movie.cast.map((person) => (
              <span className="cast-pill" key={person}>
                {person}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Button onClick={() => setTrailer(true)}>Watch trailer</Button>
            <Button onClick={book} disabled={!canBook}>
              Book tickets
            </Button>
            <Button variant="ghost" onClick={scrollToReviews}>
              Read Reviews ({verdictData.totalCount})
            </Button>
          </div>

          {!canBook ? (
            <p className="muted" style={{ marginTop: 12 }}>
              {movie.status === 'coming-soon'
                ? 'Advance booking opens closer to release.'
                : 'No theatres are listing this title in the selected city yet.'}
            </p>
          ) : (
            <p className="muted" style={{ marginTop: 12 }}>
              Playing at {theatreCount} theatre{theatreCount === 1 ? '' : 's'} in this city.{' '}
              <Link to={`/movies/${movie.id}/showtimes`}>See showtimes</Link>
            </p>
          )}

          {cityShows.length > 0 ? (
            <div className="panel" style={{ marginTop: 24 }}>
              <h3>Tonight in this city</h3>
              <p className="muted">
                {Array.from(
                  new Set(cityShows.map((s) => getTheatreById(s.theatreId)?.name)),
                )
                  .slice(0, 4)
                  .join(' · ')}
              </p>
            </div>
          ) : null}
        </div>
        {trailer ? <TrailerModal movie={movie} onClose={() => setTrailer(false)} /> : null}
      </section>

      {/* Moctale-inspired Audience Reviews & Verdict Section */}
      <div className="container" style={{ marginTop: 48, marginBottom: 64 }}>
        <MovieReviewsSection movie={movie} />
      </div>
    </div>
  )
}
