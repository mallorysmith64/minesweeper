import React, { Component } from 'react'
import axios from 'axios'

export class GameBoard extends Component {
  state = {
    board: [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']],
    currentPlayer: 'X'
  }

GameBoard = Component => {
  componentDidMount() {
    Axios({
      method: 'post',
      url: 'http://minesweeper-api.herokuapp.com/games'
    }).then(result => {
      console.log(result)
    })
  }

  render() {
    return (
      <>
        <h1>something here</h1>
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

// import Axios from 'axios'
