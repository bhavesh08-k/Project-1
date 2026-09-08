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
      <p className="container muted" style={{ marginTop: 24, fontSize: 12 }}>
        © {new Date().getFullYear()} NOIRBOX. Frontend demo. Mock data only.
      </p>
    </footer>
  )
}
