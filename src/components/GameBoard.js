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
    id: 0,
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
    // console.log(x, y)
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

  gameResults = async () => {
    if (this.state.status === 'lost') {
      this.setState({
        status: 'You lost!'
      })
    } else if (this.state.status === 'won') {
      this.setState({
        status: 'You win!'
      })
    } else
      this.setState({
        status: 'keep playing!'
      })
  }

  render() {
    return (
      <>
        <nav className="page-title">
          <h1>Bomb Sniffer!</h1>
        </nav>
        {/* <section displayResults={this.state.status}></section>
        <h2 className="game-over">{this.props.displayResults}</h2> */}
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
            <li className="reset-button">
              <button onClick={this.makeGame}>Reset Game</button>
            </li>
          </table>
        </main>
      </>
    )
  }
}

export default GameBoard
