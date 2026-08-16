import React, { Component } from 'react'

export class Cell extends Component {
  render() {
    return (
      <td
        onClick={this.props.handleLeftClick}
        onContextMenu={e => {
          this.props.handleRightClick()
          e.preventDefault()
        }}
      >
        {this.props.display}
      </td>
    )
  }
}

export default Cell
