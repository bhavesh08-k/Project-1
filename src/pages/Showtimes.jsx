import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import TheatreCard from '../components/TheatreCard'
import { useApp } from '../context/AppContext'
import { locations } from '../data/locations'
import { getMovieById } from '../data/movies'
import { getBookingDates, getShowsForMovie } from '../data/shows'

export default function Showtimes() {
  const { movieId } = useParams()
  const movie = getMovieById(movieId)
  const { city, draft, updateDraft } = useApp()
  const navigate = useNavigate()
  const dates = useMemo(() => getBookingDates(), [])
  const selectedDate = draft.date || dates[0]?.iso

  const shows = useMemo(
    () => getShowsForMovie(movieId, city, selectedDate),
    [movieId, city, selectedDate],
  )

  const grouped = useMemo(() => {
    const map = new Map()
    shows.forEach((show) => {
      if (!map.has(show.theatreId)) map.set(show.theatreId, [])
      map.get(show.theatreId).push(show)
    })
    return [...map.entries()]
  }, [shows])

  if (!movie) {
    return <EmptyState title="Movie not found" to="/movies" cta="Back to movies" />
  }

  if (movie.status !== 'now-showing') {
    return (
      <EmptyState
        title="Not open for booking"
        message="This title is coming soon in the demo catalogue."
        to={`/movies/${movie.id}`}
        cta="View details"
      />
    )
  }

  const cityName = locations.find((l) => l.id === city)?.name

  const selectShow = (show) => {
    updateDraft({
      movieId: movie.id,
      theatreId: show.theatreId,
      showId: show.id,
      date: show.date,
      seats: [],
    })
  }

  const goToSeats = () => {
    if (draft.showId) navigate(`/seats/${draft.showId}`)
  }

  return (
    <section className="section container">
      <p className="kicker">{cityName}</p>
      <h1 className="page-title">{movie.title}</h1>
      <p className="muted">
        Choose a date, theatre, format and showtime. Ticket prices vary by screen and seat category.
      </p>
      <div className="date-strip">
        {dates.map((d) => (
          <button
            key={d.iso}
            type="button"
            className={`date-chip ${selectedDate === d.iso ? 'active' : ''}`}
            onClick={() => updateDraft({ date: d.iso, showId: null, seats: [] })}
          >
            <div>{d.label}</div>
            <strong>
              {d.day} {d.month}
            </strong>
          </button>
        ))}
      </div>
      {grouped.length === 0 ? (
        <EmptyState
          title="No shows in this city"
          message="Switch location from the navbar or pick another date."
        />
      ) : (
        <div className="theatre-list">
          {grouped.map(([theatreId, theatreShows]) => (
            <TheatreCard
              key={theatreId}
              theatreId={theatreId}
              shows={theatreShows}
              selectedShowId={draft.showId}
              onSelectShow={selectShow}
              onSelectSeats={goToSeats}
            />
          ))}
        </div>
      )}
    </section>
  )
}
