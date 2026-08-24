import React from 'react'

// Works out what kind of cell this is (hidden / revealed number / flag / mine)
// from the display value coming out of your backend. If your API uses different
// markers than 'flag'/'mine'/'F'/'M'/emoji, just tweak the checks below.
const getCellClass = display => {
  const value =
    display === undefined || display === null ? '' : String(display).toLowerCase()

  if (value.includes('flag') || value === '🚩' || value === 'f') {
    return 'cell flagged'
  }
  if (value.includes('mine') || value === '💣' || value === '🌵' || value === 'm') {
    return 'cell mine'
  }
  if (value === '' || value === 'hidden' || value === '□') {
    return 'cell hidden'
  }

  const num = Number(display)
  if (!isNaN(num) && num > 0) {
    return `cell revealed n${num}`
  }
  return 'cell revealed'
}

const getCellContent = display => {
  if (display === 'flag' || display === 'F') return '🚩'
  if (display === 'mine' || display === 'M') return '💣'
  if (display === 0 || display === '□' || display === '0') return ''
  return display
}

// Wrapped in React.memo so a cell only re-renders when its OWN props change.
// This only pays off if the parent passes stable (same-identity) function
// props instead of a fresh arrow function on every render - see GameBoard.js,
// which now passes row/col + the raw apiCheckGame/apiFlagGame references
// instead of wrapping them in per-cell closures.
export const Cell = React.memo(function Cell({ display, row, col, onLeftClick, onRightClick }) {
  return (
    <div
      className={getCellClass(display)}
      onClick={() => onLeftClick(row, col)}
      onContextMenu={e => {
        e.preventDefault()
        onRightClick(row, col)
      }}
    >
      {getCellContent(display)}
    </div>
  )
})

export default Cell