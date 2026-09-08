import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookingSummary from '../components/BookingSummary'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import { useApp } from '../context/AppContext'
import { getMovieById } from '../data/movies'
import { getShowById } from '../data/shows'
import { getTheatreById } from '../data/theatres'
import { createBookingId, priceBreakdown } from '../utils/bookingUtils'
import { clearDraft, markSeatsOccupied, saveBooking } from '../utils/storage'

const METHODS = ['UPI', 'Credit / Debit Card', 'Net Banking']

export default function Checkout() {
  const { draft, user, resetDraft } = useApp()
  const show = getShowById(draft.showId)
  const navigate = useNavigate()
  const [method, setMethod] = useState(METHODS[0])
  const [upi, setUpi] = useState('')
  const [card, setCard] = useState('')
  const [bank, setBank] = useState('HDFC Bank')
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)

  if (!show || !draft.seats?.length) {
    return (
      <EmptyState
        title="Nothing to checkout"
        message="Select seats for a show before paying."
        to="/movies"
        cta="Find a movie"
      />
    )
  }

  const movie = getMovieById(show.movieId)
  const theatre = getTheatreById(show.theatreId)
  const breakdown = priceBreakdown(show, draft.seats)

  const pay = async (event) => {
    event.preventDefault()
    if (method === 'UPI' && !upi.includes('@')) {
      setError('Enter a valid UPI ID (demo), e.g. name@okbank.')
      return
    }
    if (method === 'Credit / Debit Card' && card.replace(/\s/g, '').length < 16) {
      setError('Enter a 16-digit demo card number. No charge will be made.')
      return
    }
    setError('')
    setPaying(true)
    await new Promise((r) => setTimeout(r, 1200))
    const booking = {
      id: createBookingId(),
      movieId: movie.id,
      theatreId: theatre.id,
      showId: show.id,
      date: show.date,
      time: show.time,
      format: show.format,
      seats: draft.seats,
      total: breakdown.total,
      subtotal: breakdown.subtotal,
      convenienceFee: breakdown.convenienceFee,
      method,
      bookedAt: new Date().toISOString(),
      userName: user?.name ?? 'Guest',
    }
    saveBooking(booking)
    markSeatsOccupied(show.id, draft.seats)
    clearDraft()
    resetDraft()
    navigate(`/confirmation/${booking.id}`)
  }

  return (
    <section className="section container">
      <h1 className="page-title">Checkout</h1>
      <p className="muted">Mock payment only. Do not enter real card or UPI details.</p>
      <div className="checkout-grid">
        <form className="panel" onSubmit={pay}>
          <h3>Payment method</h3>
          {METHODS.map((item) => (
            <button
              key={item}
              type="button"
              className={`pay-option ${method === item ? 'active' : ''}`}
              onClick={() => setMethod(item)}
            >
              {item}
            </button>
          ))}
          {method === 'UPI' ? (
            <input className="field" placeholder="yourname@upi" value={upi} onChange={(e) => setUpi(e.target.value)} />
          ) : null}
          {method === 'Credit / Debit Card' ? (
            <input
              className="field"
              placeholder="ACCT-000015"
              value={card}
              onChange={(e) => setCard(e.target.value)}
            />
          ) : null}
          {method === 'Net Banking' ? (
            <select className="select" value={bank} onChange={(e) => setBank(e.target.value)} style={{ width: '100%' }}>
              <option>HDFC Bank</option>
              <option>ICICI Bank</option>
              <option>SBI</option>
              <option>Axis Bank</option>
            </select>
          ) : null}
          {error ? <p className="error">{error}</p> : null}
          <Button type="submit" style={{ width: '100%', marginTop: 16 }} disabled={paying}>
            {paying ? 'Processing demo payment…' : `Pay ${breakdown.total.toLocaleString('en-IN')}`}
          </Button>
        </form>
        <BookingSummary movie={movie} theatre={theatre} show={show} seats={draft.seats} breakdown={breakdown} />
      </div>
    </section>
  )
}
