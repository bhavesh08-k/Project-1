import { buildSeatMap } from '../utils/bookingUtils'

export default function SeatMap({ occupied, selected, onToggle }) {
  const rows = buildSeatMap()

  return (
    <div>
      <div className="screen">Screen this way</div>
      <div className="seat-rows">
        {rows.map((row) => (
          <div key={row.row} className="seat-row">
            <span className="row-label">{row.row}</span>
            {row.seats.map((seat, index) => {
              const isOccupied = occupied.has(seat.id)
              const isSelected = selected.includes(seat.id)
              const aisle = index === Math.floor(row.seats.length / 2)
              return (
                <button
                  key={seat.id}
                  type="button"
                  title={`${seat.id} · ${seat.category}`}
                  className={`seat ${seat.category} ${
                    isOccupied ? 'occupied' : isSelected ? 'selected' : 'available'
                  }`}
                  style={aisle ? { marginLeft: 14 } : undefined}
                  disabled={isOccupied}
                  onClick={() => onToggle(seat.id)}
                >
                  {seat.number}
                </button>
              )
            })}
            <span className="row-label">{row.row}</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <span>
          <i className="swatch" /> Available
        </span>
        <span>
          <i className="swatch" style={{ background: 'var(--gold)' }} /> Selected
        </span>
        <span>
          <i className="swatch" style={{ background: 'var(--occupied)' }} /> Occupied
        </span>
      </div>
    </div>
  )
}
