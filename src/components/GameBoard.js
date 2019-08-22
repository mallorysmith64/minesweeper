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
      console.log(result)
      // this.setState({ board: data.results })
    })
  }

  render() {
    return (
      <>
        <div>GameBoard</div>
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

// ['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']
