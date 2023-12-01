// Variables for testing.
const DEBUG_NTURNS = 3;

const gameBoard = (function () {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const mark = function (coordinates, markSymbol) {
    // Marks the `coordinates` with `markSymbol`.
    // Returns 1 if successful, 0 otherwise

    const [x, y] = coordinates;
    if (board[x][y] === null) {
      board[x][y] = markSymbol;
      return 1;
    }
    return 0;
  };

  return { board, mark };
})();

function createPlayer(markSymbol) {
  let score = 0;

  const getScore = function () {
    return score;
  };

  const resetScore = function () {
    score = 0;
  };

  const win = function () {
    score++;
  };

  return { markSymbol, win, getScore, resetScore };
}

const gameflow = function (playerA, playerB) {
  let currentPlayerIndex = 0;
  const players = [playerA, playerB];

  let x = 0;
  do {
    // Transform "XY" to [X int, Y int]
    const coordinates = askUserCoordinates(); // -1 is for "real" coordinates
    // since input is assuming indexed 1. (first cell is at (1, 1))

    const currentPlayer = players[currentPlayerIndex];

    if (gameBoard.mark(coordinates, currentPlayer.markSymbol) === 0) {
      console.log(`(${coordinates.map((x) => x + 1)}) is already marked. Change location.`);
    }

    currentPlayerIndex = currentPlayerIndex == 1 ? 0 : 1;
    x++;
    console.log(gameBoard.board);
  } while (x < DEBUG_NTURNS);
};

// Helper functions
function askUserCoordinates() {
  return prompt("Coordinates: (1, 1) through (3, 3)")
    .split("")
    .map((x) => +x - 1);
}

const p1 = createPlayer("x");
const p2 = createPlayer("o");
const g = gameflow(p1, p2);
