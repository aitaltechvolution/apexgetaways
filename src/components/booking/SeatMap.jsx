import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, Info } from 'lucide-react'

// Generate realistic seat map for different cabin classes
function generateSeatMap(totalSeats = 120, config = {}) {
  const {
    firstRows = 2,
    businessRows = 4,
    premiumRows = 4,
    economyRows = 14,
    firstCols = ['A','C','D','F'],
    bizCols = ['A','C','D','F'],
    premCols = ['A','B','C','D','E','F'],
    ecoCols = ['A','B','C','D','E','F'],
  } = config

  const rows = []
  let rowNum = 1

  // First class
  for (let r = 0; r < firstRows; r++, rowNum++) {
    rows.push({ num: rowNum, cabin: 'first', cols: firstCols, occupied: generateOccupied(firstCols, 0.2) })
  }
  // Business
  for (let r = 0; r < businessRows; r++, rowNum++) {
    rows.push({ num: rowNum, cabin: 'business', cols: bizCols, occupied: generateOccupied(bizCols, 0.35) })
  }
  // Premium Economy
  rows.push({ num: rowNum++, cabin: 'exit', cols: [], label: '🚪 Emergency Exit' })
  for (let r = 0; r < premiumRows; r++, rowNum++) {
    rows.push({ num: rowNum, cabin: 'premium', cols: premCols, occupied: generateOccupied(premCols, 0.45) })
  }
  // Economy
  rows.push({ num: rowNum++, cabin: 'exit', cols: [], label: '🚪 Emergency Exit' })
  for (let r = 0; r < economyRows; r++, rowNum++) {
    rows.push({ num: rowNum, cabin: 'economy', cols: ecoCols, occupied: generateOccupied(ecoCols, 0.6) })
  }

  return rows
}

function generateOccupied(cols, rate) {
  return cols.reduce((acc, c) => ({ ...acc, [c]: Math.random() < rate }), {})
}

const CABIN_COLORS = {
  first:    { bg: 'bg-purple-100 dark:bg-purple-900/30', label: 'First Class',    extra: '$120' },
  business: { bg: 'bg-blue-100 dark:bg-blue-900/30',    label: 'Business',        extra: '$60' },
  premium:  { bg: 'bg-sky-100 dark:bg-sky-900/30',      label: 'Premium Economy', extra: '$25' },
  economy:  { bg: 'bg-gray-50 dark:bg-gray-800/30',     label: 'Economy',         extra: '' },
}

function Seat({ col, row, cabin, occupied, selected, onClick, selectable }) {
  const isWindow = col === 'A' || col === 'F'
  const isAisle = col === 'C' || col === 'D'

  let seatStyle = ''
  if (occupied) seatStyle = 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
  else if (selected) seatStyle = 'bg-primary text-white shadow-glow scale-110 cursor-pointer'
  else if (!selectable) seatStyle = 'bg-gray-200 dark:bg-gray-700 opacity-40 cursor-not-allowed'
  else seatStyle = 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/10 cursor-pointer hover:scale-105'

  return (
    <div className={`relative flex flex-col items-center ${isAisle ? 'ml-3' : ''}`}>
      <motion.button
        whileHover={!occupied && selectable ? { scale: 1.1 } : {}}
        whileTap={!occupied && selectable ? { scale: 0.95 } : {}}
        onClick={() => !occupied && selectable && onClick(`${row}${col}`)}
        disabled={occupied || !selectable}
        title={occupied ? 'Occupied' : `Seat ${row}${col}${isWindow ? ' (Window)' : isAisle ? ' (Aisle)' : ' (Middle)'}`}
        className={`w-7 h-8 sm:w-8 sm:h-9 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-150 ${seatStyle}`}
      >
        {selected ? '✓' : occupied ? '' : col}
      </motion.button>
    </div>
  )
}

export default function SeatMap({ flight, passengers = 1, onConfirm, onClose, selectedClass = 'economy' }) {
  const [seatMap] = useState(() => generateSeatMap())
  const [selected, setSelected] = useState([])

  const toggleSeat = useCallback((seatId) => {
    setSelected(prev => {
      if (prev.includes(seatId)) return prev.filter(s => s !== seatId)
      if (prev.length >= passengers) return [...prev.slice(1), seatId]
      return [...prev, seatId]
    })
  }, [passengers])

  const classSelectable = (cabin) => {
    if (selectedClass === 'first') return cabin === 'first'
    if (selectedClass === 'business') return cabin === 'business' || cabin === 'first'
    if (selectedClass === 'premium_economy') return cabin === 'premium'
    return cabin === 'economy'
  }

  const groupedCols = {
    left: ['A','B','C'],
    right: ['D','E','F'],
    leftNarrow: ['A','C'],
    rightNarrow: ['D','F'],
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        className="bg-white dark:bg-card-dark rounded-3xl shadow-2xl w-full max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Choose Your Seat{passengers > 1 ? 's' : ''}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{flight?.flightNo} · {flight?.from} → {flight?.to} · Select {passengers} seat{passengers > 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex-wrap">
          {[
            { color:'bg-white border border-gray-300', label:'Available' },
            { color:'bg-primary', label:'Selected' },
            { color:'bg-gray-300 dark:bg-gray-600', label:'Occupied' },
            { color:'bg-gray-200 dark:bg-gray-700 opacity-50', label:'Other class' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-4 h-4 rounded-sm ${color}`} />
              <span className="text-[11px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Plane visual */}
        <div className="px-4 py-4 overflow-y-auto max-h-[50vh]">
          {/* Nose */}
          <div className="text-center mb-4">
            <div className="inline-block text-3xl">✈️</div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Front of Aircraft</p>
          </div>

          <div className="space-y-1">
            {seatMap.map((row) => {
              if (row.cabin === 'exit') {
                return (
                  <div key={`exit-${row.num}`} className="flex items-center justify-center py-2">
                    <div className="flex-1 h-px bg-green-300 dark:bg-green-800" />
                    <span className="mx-3 text-xs text-green-600 font-semibold">{row.label}</span>
                    <div className="flex-1 h-px bg-green-300 dark:bg-green-800" />
                  </div>
                )
              }
              const cols = row.cols
              const left = cols.slice(0, Math.ceil(cols.length / 2))
              const right = cols.slice(Math.ceil(cols.length / 2))
              const selectable = classSelectable(row.cabin)
              const cabinColor = CABIN_COLORS[row.cabin]?.bg || ''

              return (
                <div key={row.num} className={`flex items-center gap-2 px-2 py-0.5 rounded-lg ${cabinColor}`}>
                  {/* Row number */}
                  <span className="text-[10px] text-gray-400 w-5 text-center font-mono">{row.num}</span>

                  {/* Left seats */}
                  <div className="flex gap-1">
                    {left.map(col => (
                      <Seat key={col} col={col} row={row.num} cabin={row.cabin}
                        occupied={row.occupied[col]}
                        selected={selected.includes(`${row.num}${col}`)}
                        selectable={selectable}
                        onClick={toggleSeat} />
                    ))}
                  </div>

                  {/* Aisle */}
                  <div className="w-6 flex items-center justify-center">
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>

                  {/* Right seats */}
                  <div className="flex gap-1">
                    {right.map(col => (
                      <Seat key={col} col={col} row={row.num} cabin={row.cabin}
                        occupied={row.occupied[col]}
                        selected={selected.includes(`${row.num}${col}`)}
                        selectable={selectable}
                        onClick={toggleSeat} />
                    ))}
                  </div>

                  {/* Cabin label on first row of each cabin */}
                  <span className="ml-2 text-[9px] text-gray-400 w-16 truncate">
                    {CABIN_COLORS[row.cabin]?.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Rear of Aircraft</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Selected: {selected.length > 0 ? selected.join(', ') : 'None'}
              </p>
              <p className="text-xs text-gray-400">{passengers - selected.length} more seat{passengers - selected.length !== 1 ? 's' : ''} needed</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Seat fee</p>
              <p className="font-bold text-primary">{selected.length > 0 ? 'Included' : '—'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => onConfirm([])} className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-all">
              Skip — Random Seat
            </button>
            <button
              onClick={() => selected.length === passengers ? onConfirm(selected) : null}
              disabled={selected.length !== passengers}
              className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-primary-gradient shadow-glow hover:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              Confirm Seat{passengers > 1 ? 's' : ''} →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
