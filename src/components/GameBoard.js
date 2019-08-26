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
  makeGame = async (difficulty = 0) => {
    const result = await axios.post(
      `http://minesweeper-api.herokuapp.com/games`,
      { difficulty: difficulty }
    )
    this.setState({
      board: result.data.board,
      id: result.data.id,
      difficulty: difficulty
    })
    console.log('start game', result)
  }

  componentDidMount() {
    this.makeGame()
  }

  //call api to get id for game
  // apiGetGame = async () => {
  //   const result = await axios.post(
  //     `http://minesweeper-api.herokuapp.com/games/${this.state.id}`
  //   )
  //   this.setState({
  //     board: result.data.board,
  //     id: result.data.id
  //   })
  //   console.log('received id', result)
  // }

  //easiest mode in game
  setDifficulty = async difficulty => {
    this.setState({ difficulty: difficulty }, this.makeGame)
    console.log('difficulty', difficulty)
    this.makeGame(difficulty)
  }

  //medium mode in game
  // medium = async () => {
  //   this.setState({ difficulty: 1 }, this.makeGame)
  //   console.log('medium mode')
  // }

  // //hardiest mode in game
  // hard = async () => {
  //   this.setState({ difficulty: 2 }, this.makeGame)
  //   console.log('hard mode')
  // }

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

  resetGame = () => {
    this.makeGame(0)
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
        <section className="choose-difficulty">
          <h3> Choose your difficulty</h3>
        </section>
        <section className="difficulty-btn">
          <button
            onClick={() => {
              this.setDifficulty(0)
            }}
          >
            Easy Mode
          </button>
          <button
            onClick={() => {
              this.setDifficulty(1)
            }}
          >
            Medium Mode
          </button>
          <button
            onClick={() => {
              this.setDifficulty(2)
            }}
          >
            Hard mode
          </button>
        </section>
        <section className="game-over">
          <h2>{this.state.state}</h2>
        </section>
        <section className="reset-btn">
          <li>
            <button onClick={this.resetGame}>Reset Game</button>
          </li>
        </section>
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
