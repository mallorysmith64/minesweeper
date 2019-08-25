import React, { Component } from 'react'
import axios from 'axios'
import Cell from './Cell'

export class GameBoard extends Component {
  state = {
    board: [],
    difficulty: 0, //Easy - 8x8, 10 mines
    id: 0,
    //display winner and loser message
    message: '',
    status: ''
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
    console.log('checked', result)
    this.setState({
      board: result.data.board,
      state: result.data.state
    })
    console.log(this.state.state) //2nd state found in the console
    this.gameResults()
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

  // renderSymbols = (i, j) => {
  //   let symbols = ''
  //   if (this.state.board[i][j] === 'F') {
  //     symbols = 'flag'
  //   }
  //   return (
  //     <td
  //     className={`squares ${symbols}`}
  //     key={j}
  //     onClick={() => this.}
  //   )
  // }

  // changeSymbols(i, j) {
  //   if (this.state.game.board[i][j] === 'F') {
  //     return <span role="img">🚩</span>
  //   }
  // }

  gameResults = async () => {
    if (this.state.status === 'lost') {
      this.setState({
        message: 'You lost!'
      })
    } else if (this.state.status === 'won') {
      this.setState({
        message: 'You win!'
      })
    } else
      this.setState({
        message: 'Keep playing!'
      })
  }

  render() {
    return (
      <>
        <nav className="page-title">
          <h1>Bomb Sniffer!</h1>
        </nav>
        <section className="game-over">
          <h2>{this.state.state}</h2>
        </section>
        <li className="reset-button">
          <button onClick={this.makeGame}>Reset Game</button>
        </li>
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
      </>
    )
  }
}

export default GameBoard
