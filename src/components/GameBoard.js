import React, { Component } from 'react'
import axios from 'axios'

export class GameBoard extends Component {
  state = {
    // currentPlayer: 'X',
    board: [],
    difficulty: 0, //Easy - 8x8, 10 mines
    id: 0
  }

  //call api to start game
  componentDidMount() {
    axios({
      method: 'post',
      url: 'http://minesweeper-api.herokuapp.com/games'
    }).then(result => {
      console.log('start of game!', result)
      this.setState({
        // state: result,
        board: result.data.board,
        id: result.data.board
      })
    })
  }

  //left click for checks
  checkGame = async minesweeperData => {
    const result = await axios.post(
      `http://minesweeper-api.herokuapp.com/games/${this.state.id}/check`
    )
    this.setState({
      board: result.data.board
    })
    console.log('checked', result)
  }

  //right click for flags
  flagGame = async minesweeperData => {
    const result = await axios.post(
      `http://minesweeper-api.herokuapp.com/games/${this.state.id}/flag`
    )
    this.setState({
      board: result.data.board
    })
    console.log('flagged', result)
  }

  //todo
  // leftClick = (x, y) => {
  //   console.log('left click', x, y) //console left clicks for checks
  //   this.checkGame //api call
  // }

  // rightClick = (x, y) => {
  //   console.log('right click', x, y) //console right clicks for flags
  //   this.FlagGame //api call
  // }

  reset = () => {
    this.setState({
      board: [],
      difficulty: 0,
      id: 0
    })
  }

  render() {
    return (
      <>
        <h1>Minesweeper</h1>
        <button onClick={this.reset}>reset</button>
        <main>
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
                          handleLeftClick={() => this.cellLeftClicked(i, j)}
                          handleRightClick={() => this.cellRightClicked(i, j)}
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

class Cell extends Component {
  render() {
    return (
      <td
        onClick={this.props.handleLeftClick}
        onContextMenu={this.handleRightClick}
      >
        {this.props.display}
      </td>
    )
  }
}
export default GameBoard

/* {this.state.board.map((row, j) => {
    return (
      <div key={j}>
        {row.map((column, i) => {
          return (
            <span
              key={i}
              className="box"
              onClick={() => this.setCheck(i, j)}
              onContextMenu={event => this.setFlag(event, i, j)}
            >
              {this.state.board[i][j]} {`${''}`}
            </span>
          )
        })}
      </div>
    )
  })} */
