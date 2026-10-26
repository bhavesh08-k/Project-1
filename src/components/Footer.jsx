import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-name">NOIRBOX</div>
          <p>A demo cinema booking experience. No real tickets, payments, or reservations are created.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <p><Link to="/">Home</Link></p>
          <p><Link to="/movies">Movies</Link></p>
          <p><Link to="/bookings">My Bookings</Link></p>
        </div>
        <div>
          <h4>Cities</h4>
          <p>Mumbai · Delhi NCR · Bengaluru</p>
          <p>Hyderabad · Pune · Chennai</p>
        </div>
      </div>
      <div className="container" style={{ marginTop: 24 }}>
        <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.themoviedb.org/assets/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
            alt="TMDB"
            width="100"
            height="25"
          />
        </a>
        <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
          Some movie artwork and metadata are sourced from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
      <p className="container muted" style={{ marginTop: 24, fontSize: 12 }}>
        © {new Date().getFullYear()} NOIRBOX. Frontend demo. Showtimes and bookings are mock data.
      </p>
    </footer>
  )
}
