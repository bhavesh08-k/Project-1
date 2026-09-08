import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import TrailerModal from '../components/TrailerModal'
import { useApp } from '../context/AppContext'
import { getMovieById } from '../data/movies'
import { getShowsForMovie } from '../data/shows'
import { getTheatreById } from '../data/theatres'
import { formatDuration } from '../utils/bookingUtils'

export default function MovieDetails() {
  const { movieId } = useParams()
  const movie = getMovieById(movieId)
  const { city, updateDraft } = useApp()
  const [trailer, setTrailer] = useState(false)
  const navigate = useNavigate()

  if (!movie) {
    return <EmptyState title="Movie not found" message="This title is not in the demo catalogue." to="/movies" cta="Browse movies" />
  }

  const cityShows = getShowsForMovie(movie.id, city)
  const theatreCount = new Set(cityShows.map((s) => s.theatreId)).size
  const canBook = movie.status === 'now-showing' && cityShows.length > 0

  const book = () => {
    updateDraft({ movieId: movie.id, seats: [] })
    navigate(`/movies/${movie.id}/showtimes`)
  }

  return (
    <section className="container details">
      <div className="details-poster">
        <img src={movie.poster} alt={movie.title} />
      </div>
      <div>
        <p className="kicker">{movie.status === 'now-showing' ? 'Now showing' : 'Coming soon'}</p>
        <h1 className="page-title">{movie.title}</h1>
        <p className="muted">{movie.tagline}</p>
        <div className="meta-row">
          {movie.rating > 0 ? <span className="chip">★ {movie.rating}</span> : <span className="chip">Unrated</span>}
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
          <strong>Release</strong> · {movie.releaseDate} &nbsp;|&nbsp; <strong>Director</strong> · {movie.director}
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
              {Array.from(new Set(cityShows.map((s) => getTheatreById(s.theatreId)?.name)))
                .slice(0, 4)
                .join(' · ')}
            </p>
          </div>
        ) : null}
      </div>
      {trailer ? <TrailerModal movie={movie} onClose={() => setTrailer(false)} /> : null}
    </section>
  )
}
