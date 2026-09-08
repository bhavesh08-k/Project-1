export default function TicketGraphic({ bookingId }) {
  const cells = Array.from({ length: 49 }, (_, i) => {
    let h = 0
    const s = `${bookingId}-${i}`
    for (let c = 0; c < s.length; c += 1) h = (h * 31 + s.charCodeAt(c)) >>> 0
    return h % 3 !== 0
  })

  return (
    <div className="qr" aria-hidden="true">
      {cells.map((on, i) => (
        <i key={i} className={on ? '' : 'off'} />
      ))}
    </div>
  )
}
