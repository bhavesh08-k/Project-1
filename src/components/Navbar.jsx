import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { locations } from '../data/locations'
import Button from './Button'
import LoginModal from './LoginModal'

export default function Navbar() {
  const { city, setCity, user, logout, searchQuery, setSearchQuery } = useApp()
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const navigate = useNavigate()

  const submitSearch = (event) => {
    event.preventDefault()
    setOpen(false)
    navigate(`/movies?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">N</span>
          <span className="brand-name">NOIRBOX</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/bookings">My Bookings</NavLink>
        </nav>
        <form className="nav-search" onSubmit={submitSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, genres, languages"
            aria-label="Search movies"
          />
        </form>
        <div className="nav-actions">
          <select
            className="select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Select city"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          {user ? (
            <Button variant="ghost" onClick={logout}>
              {user.name.split(' ')[0]}
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setLoginOpen(true)}>
              Login
            </Button>
          )}
        </div>
        <button className="menu-btn" type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          ☰
        </button>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <NavLink to="/" onClick={() => setOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/movies" onClick={() => setOpen(false)}>
          Movies
        </NavLink>
        <NavLink to="/bookings" onClick={() => setOpen(false)}>
          My Bookings
        </NavLink>
        <form onSubmit={submitSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies"
          />
        </form>
        <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        {user ? (
          <Button variant="ghost" onClick={logout}>
            Sign out
          </Button>
        ) : (
          <Button onClick={() => setLoginOpen(true)}>Login</Button>
        )}
      </div>
      {loginOpen ? <LoginModal onClose={() => setLoginOpen(false)} /> : null}
    </header>
  )
}
