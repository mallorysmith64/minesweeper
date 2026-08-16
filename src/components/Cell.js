import React, { Component } from 'react'

export class Cell extends Component {
  // Works out what kind of cell this is (hidden / revealed number / flag / mine)
  // from the display value coming out of your backend. If your API uses different
  // markers than 'flag'/'mine'/'F'/'M'/emoji, just tweak the checks below.
  getCellClass = () => {
    const { display } = this.props
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

  getCellContent = () => {
    const { display } = this.props
    if (display === 'flag' || display === 'F') return '🚩'
    if (display === 'mine' || display === 'M') return '💣'
    if (display === 0 || display === '□' || display === '0') return ''
    return display
  }

  render() {
    return (
      <div
        className={this.getCellClass()}
        onClick={this.props.handleLeftClick}
        onContextMenu={e => {
          this.props.handleRightClick()
          e.preventDefault()
        }}
      >
        {this.getCellContent()}
      </div>
    )
  }
}

export default Cell