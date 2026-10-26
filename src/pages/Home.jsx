import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieGrid from '../components/MovieGrid'
import { useApp } from '../context/AppContext'
import { locations } from '../data/locations'
import { getComingSoon, getNowShowing, getPopular } from '../data/movies'
import { formatDuration } from '../utils/bookingUtils'

export default function Home() {
  const { city, setCity, searchQuery, setSearchQuery } = useApp()
  const now = getNowShowing()
  const soon = getComingSoon()
  const popular = getPopular()
  const featuredMovies = now.slice(0, 5)
  const [activeSlide, setActiveSlide] = useState(0)
  const featured = featuredMovies[activeSlide]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % featuredMovies.length)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [featuredMovies.length])

  function showSlide(index) {
    setActiveSlide((index + featuredMovies.length) % featuredMovies.length)
  }

  const filteredNow = searchQuery
    ? now.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : now

  return (
    <div>
      <section className="hero" aria-label="Featured movies">
        <div
          key={featured.id}
          className="hero-bg"
          style={{ backgroundImage: `url(${featured.backdrop})` }}
        />
        <div className="container hero-content">
          <p className="kicker">Now showing in {locations.find((l) => l.id === city)?.name}</p>
          <h1>{featured.title}</h1>
          <p className="muted">{featured.tagline}</p>
          <div className="chip-row">
            {featured.rating > 0 && <span className="chip">★ {featured.rating}</span>}
            {featured.genres.map((g) => (
              <span className="chip" key={g}>
                {g}
              </span>
            ))}
            <span className="chip">{featured.language}</span>
            {featured.duration && <span className="chip">{formatDuration(featured.duration)}</span>}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={`/movies/${featured.id}/showtimes`} className="btn btn-primary">
              Book tickets
            </Link>
            <Link to={`/movies/${featured.id}`} className="btn btn-ghost">
              View details
            </Link>
          </div>
        </div>
        <div className="hero-controls" aria-label="Featured movie slides">
          <button
            className="hero-arrow"
            type="button"
            onClick={() => showSlide(activeSlide - 1)}
            aria-label="Previous movie"
          >
            ‹
          </button>
          <div className="hero-dots">
            {featuredMovies.map((movie, index) => (
              <button
                key={movie.id}
                className={`hero-dot${index === activeSlide ? ' active' : ''}`}
                type="button"
                onClick={() => showSlide(index)}
                aria-label={`Show slide ${index + 1}: ${movie.title}`}
                aria-current={index === activeSlide ? 'true' : undefined}
              />
            ))}
          </div>
          <button
            className="hero-arrow"
            type="button"
            onClick={() => showSlide(activeSlide + 1)}
            aria-label="Next movie"
          >
            ›
          </button>
        </div>
      </section>

      <section className="section container">
        <form
          className="filters"
          onSubmit={(e) => e.preventDefault()}
          style={{ gridTemplateColumns: '1fr 220px' }}
        >
          <input
            className="field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search now showing"
          />
          <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </form>

        <div className="section-head">
          <h2 className="section-title">Now showing</h2>
          <Link to="/movies" className="muted">
            See all
          </Link>
        </div>
        {filteredNow.length ? (
          <MovieGrid movies={filteredNow} />
        ) : (
          <p className="muted">No titles match that search.</p>
        )}
      </section>

      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">Popular this week</h2>
        </div>
        <MovieGrid movies={popular.slice(0, 4)} />
      </section>

      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">Coming soon</h2>
        </div>
        <MovieGrid movies={soon} />
      </section>
    </div>
  )
}
