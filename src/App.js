import React from "react";
import "./App.css";

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="cell"
        onClick={this.props.onClick.bind(null)}
        disabled={!!this.props.value}
      >
        {this.props.value}
      </button>
    );
  }
}
// [x, x, x, 0, 0, null, null, null, null]
const getRandomEmptyCellIndex = (cells, emptyValue = null) => {
  let choosedIndex = -1;

  const availableCells = cells.map((item) => item === emptyValue);

  if (!availableCells.filter(Boolean).length) return -1;

  while (choosedIndex < 0) {
    const randomIndex = Math.floor(Math.random() * cells.length);
    if (cells[randomIndex] === emptyValue) {
      choosedIndex = randomIndex;
    }
  }

  return choosedIndex;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: "X",
      cells: Array(9).fill(null),
      isTheGameOn: null,
      winner: null,
    };
  }

  handleChoose = (e) => {
    if (e.target.textContent === "X") {
      this.setState({
        ...this.state,
        player: "X",
        isTheGameOn: true,
      });
    }
    if (e.target.textContent === "0") {
      this.setState({
        ...this.state,
        player: "0",
        isTheGameOn: true,
      });
    }
  };

  cellClick = (i) => {
    this.setState((prev) => {
      const cells = [...prev.cells];
      cells[i] = prev.player;

      const winner = this.determineTheWinner(cells);

      return {
        ...prev,
        cells,
        player: prev.player === "0" ? "X" : "0",
        isTheGameOn: true,
        winner,
      };
    });
  };

  startNewGame = () => {
    this.setState({
      ...this.state,
      player: "X",
      winner: null,
      cells: Array(9).fill(null),
      isTheGameOn: false,
    });
  };

  help = () => {
    const index = getRandomEmptyCellIndex(this.state.cells);
    this.cellClick(index);
  };

  determineTheWinner = (cells) => {
    if (cells.filter(Boolean).length === 9) return "pair";

    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (cells[a] === cells[b] && cells[b] === cells[c] && cells[a] !== null) {
        console.log("winner", cells[a]);
        return cells[a];
      }
    }
    console.log("nobody");
    return null;
  };

  getWinnerTitleClassName = () => {
    if (this.state.winner) {
      return "winner winner-visible";
    }
    return "winner winner-hidden";
  };

  render() {
    return (
      <div className="wrapper">
        <p className={this.getWinnerTitleClassName()}>
          {this.state.winner === "pair" ? (
            "Nobody wins"
          ) : (
            <>"{this.state.winner}" is a winner!</>
          )}
        </p>
        <div className="gameContainer">
          <div className="playingField">
            {this.state.cells.map((cell, i) => (
              <Cell value={cell} onClick={this.cellClick.bind(null, i)} />
            ))}
          </div>
          <div className="gameControl">
            <p>Choose what you want to play with:</p>
            <div className="chooseButtonContainer">
              <button
                className="chooseButton"
                onClick={this.handleChoose}
                disabled={this.state.isTheGameOn}
              >
                X
              </button>
              <button
                className="chooseButton"
                onClick={this.handleChoose}
                disabled={this.state.isTheGameOn}
              >
                0
              </button>
            </div>
            <p>It's Player "{this.state.player}" turn now </p>
            <button
              className="newGameButton"
              onClick={this.startNewGame.bind(null)}
            >
              New Game
            </button>
            <button
              className="helpButton"
              onClick={this.help.bind(null)}
              disabled={this.state.winner}
            >
              Help
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
