import React, { Component } from 'react'
import axios from 'axios'

export class GameBoard extends Component {
  state = {
    // currentPlayer: 'X',
    board: []
  }

  componentDidMount() {
    axios({
      method: 'post',
      url: 'http://minesweeper-api.herokuapp.com/games'
    }).then(result => {
      console.log('start of game!', result)
      this.setState({
        state: result
      })
    })
  }

  render() {
    return (
      <>
        <div>GameBoard</div>
        {/* <div className="board">
          {this.state.board.map((row,j) => {
            return (
              <div key={j}>
                {row.map((column,i) => {
                  return (
                    <span
                    key={i}
                    className="box"
                    onClick={() => this.setCheck(i,j)}
                    onContextMenu={event => this.setFlag(event, i, j)}
                    >
                    {this.state.board[i][j]} {`${""}`}
                    </span>
                  );
                })}
        </div> */}
      </>
    )
  }
}

export default GameBoard

//   <main>something here
//     <table>
//       <tbody>
//         {this.state.board.map((col,i) => {
//         }}
//       </tbody>
//     </table>
//   </main>
// }
