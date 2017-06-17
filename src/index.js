import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.handleClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: null,
      }],
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (current.winner || squares[i]) {
      return;
    }

    squares[i] = (current.xIsNext) ? 'X' : 'O';

    const winner = calculateWinner(squares);

    this.setState({
      history: history.concat([{
        squares: squares,
        xIsNext: !current.xIsNext,
        winner: winner,
      }]),
    });
  }

  jumpTo(move) {
    if (move > this.state.history.length) {
      console.warn('Trying to jump back to the future!');
      return;
    }

    if (move < 0) {
      console.warn('Trying to jump before the beginning of time!');
      return;
    }

    const history = this.state.history.slice(0, move + 1);
    this.setState({
      history: history
    })
  }

  render() {
    const current = this.state.history[this.state.history.length - 1];

    let status;
    if (current.winner) {
      status = 'Winner: ' + current.winner;
    } else {
      status = 'Next turn: ' + ((current.xIsNext) ? 'X' : 'O');
    }

    const moves = this.state.history.map((step, move) => {
      const desc = move ? 'Move # ' + move : 'Game start'
      return (
        <li key={move}>
          <a href='#' onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            handleClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

