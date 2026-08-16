import React, { Component } from 'react'
import axios from 'axios'
import Cell from './Cell'
import '../index.css'

// Change this to your backend URL
const API_BASE_URL = 'http://localhost:5000'

export class GameBoard extends Component {
  state = {
    board: [],
    difficulty: 0,
    id: 0,
    message: '',
    state: 'playing'
  }

  //call api to make game
  makeGame = async (difficulty = 0) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/games`,
        { difficulty: difficulty }
      )
      this.setState({
        board: result.data.board,
        id: result.data.id,
        difficulty: difficulty,
        state: result.data.state,
        message: ''
      })
      console.log('start game', result)
    } catch (error) {
      console.error('Error creating game:', error)
      this.setState({
        message: 'Error connecting to server. Make sure backend is running!'
      })
    }
  }

  componentDidMount() {
    this.makeGame()
  }

  setDifficulty = async difficulty => {
    this.setState({ difficulty: difficulty })
    this.makeGame(difficulty)
  }

  //api call for left click/checks
  apiCheckGame = async (x, y) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/games/${this.state.id}/check`,
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
      this.gameResults(result.data.state)
    } catch (error) {
      console.error('Error checking cell:', error)
    }
  }

  //api call for right click/flags
  apiFlagGame = async (x, y) => {
    try {
      const result = await axios.post(
        `${API_BASE_URL}/games/${this.state.id}/flag`,
        {
          row: x,
          col: y
        }
      )
      console.log('flagged', result)
      this.setState({
        board: result.data.board
      })
    } catch (error) {
      console.error('Error flagging cell:', error)
    }
  }

  resetGame = () => {
    this.makeGame(this.state.difficulty)
  }

  gameResults = (gameState) => {
    if (gameState === 'lost') {
      this.setState({
        message: 'You lost! 💣'
      })
    } else if (gameState === 'won') {
      this.setState({
        message: 'You win! 🎉'
      })
    } else {
      this.setState({
        message: 'Keep playing!'
      })
    }
  }

  render() {
    return (
      <>
        <nav className="page-title">
          <h1>Bomb Sniffer!</h1>
        </nav>
        <section className="choose-difficulty">
          <h3>Choose your difficulty</h3>
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
            Hard Mode
          </button>
        </section>
        <section className="game-over">
          <h2>{this.state.message}</h2>
        </section>
        <section className="reset-btn">
          <li>
            <button onClick={this.resetGame}>Play Again</button>
          </li>
        </section>
        <main className="table">
          <div
            className="board"
            style={{
              gridTemplateColumns: `repeat(${
                this.state.board[0] ? this.state.board[0].length : 0
              }, 32px)`
            }}
          >
            {this.state.board.map((col, i) => {
              return (
                <div className="board-row" key={i}>
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
                </div>
              )
            })}
          </div>
        </main>
      </>
    )
  }
}

export default GameBoard