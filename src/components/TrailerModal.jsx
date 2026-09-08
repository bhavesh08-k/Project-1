import Button from './Button'

export default function TrailerModal({ movie, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" style={{ width: 'min(720px, 100%)' }} onClick={(e) => e.stopPropagation()}>
        <p className="kicker">Trailer preview</p>
        <h2>{movie.title}</h2>
        <div
          style={{
            margin: '16px 0',
            borderRadius: 16,
            overflow: 'hidden',
            minHeight: 280,
            backgroundImage: `linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.7)), url(${movie.backdrop})`,
            backgroundSize: 'cover',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <p>Demo trailer — no video is hosted in this frontend-only build.</p>
        </div>
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  )
}
