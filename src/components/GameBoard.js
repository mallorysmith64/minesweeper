import React, { Component } from 'react'
import axios from 'axios'
import Cell from './Cell'

export class GameBoard extends Component {
  state = {
    //trying out multi-dimensional array instead of an empty array
    board: [
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '']
    ],
    difficulty: 0, //Easy - 8x8, 10 mines
    id: 0
  }

  //call api to make game
  makeGame = async () => {
    const result = await axios.post(
      `http://minesweeper-api.herokuapp.com/games`
    )
    this.setState({
      board: result.data.board,
      id: result.data.id
    })
    console.log('start game', result)
  }

  //should I put async before this?
  componentDidMount() {
    this.makeGame()
  }

  //call api to get id for game
  apiGetGame = async () => {
    const result = await axios.post(
      `http://minesweeper-api.herokuapp.com/games/${this.state.id}`
    )
    this.setState({
      board: result.data.board
    })
    console.log('received id', result)
  }

  //api get left click for checks
  apiCheckGame = async (x, y) => {
    const result = await axios.post(
      `http://minesweeper-api.herokuapp.com/games/${this.state.id}/check`,
      {
        row: x,
        col: y
      }
    )
    console.log(x, y)
    this.setState({
      board: result.data.board
    })
    console.log('checked', result)
  }

  //api get right click for flags
  apiFlagGame = async (x, y) => {
    const result = await axios.post(
      `http://minesweeper-api.herokuapp.com/games/${this.state.id}/flag`,
      {
        row: x,
        col: y
      }
    )
    console.log(x, y)
    this.setState({
      board: result.data.board
    })
    console.log('flagged', result)
  }

  render() {
    return (
      <>
        <nav className="page-title">
          <h1>Bomb Sniffer!</h1>
        </nav>
        <main className="table">
          <table>
            <tbody>
              {this.state.board.map((col, i) => {
                return (
                  <tr key={i}>
                    {col.map((row, j) => {
                      return (
                        <Cell
                          key={j}
                          display={this.state.board[i][j]}
                          handleLeftClick={() => {
                            this.apiCheckGame(i, j)
                          }}
                          handleRightClick={() => {
                            this.apiFlagGame(i, j)
                          }}
                        />
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </main>
        <li className="reset-button">
          <button onClick={this.makeGame}>Reset Game</button>
        </li>
      </>
    )
  }
}

export default GameBoard

//did not like this way because i had difficulty calling this
// componentDidMount() {
//   console.log('mounting')
//   axios({
//     method: 'post',
//     url: 'http://minesweeper-api.herokuapp.com/games'
//   }).then(result => {
//     console.log('start of game!', result)
//     this.setState({
//       // state: result,
//       board: result.data.board,
//       id: result.data.board
//     })
//   })
// }

//handle left click
// leftClick = (x, y) => {
//   console.log('left click', x, y) //console left clicks for checks
//   this.apiCheckGame() //api call
// }

// //handle right click
// rightClick = (x, y) => {
//   console.log('right click', x, y) //console right clicks for flags
//   this.apiFlagGame() //api call
// }

//reset board game
// reset = () => {
//   this.setState({
//     board: [],
//     difficulty: 0,
//     id: 0
//   })
//   console.log('reset game')
// }
