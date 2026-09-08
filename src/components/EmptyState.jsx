import { Link } from 'react-router-dom'

export default function EmptyState({ title, message, to, cta }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{message}</p>
      {to && cta ? (
        <Link to={to} className="btn btn-primary" style={{ marginTop: 12 }}>
          {cta}
        </Link>
      ) : null}
    </div>
  )
}

export function Loader() {
  return <div className="loader" aria-label="Loading" />
}
