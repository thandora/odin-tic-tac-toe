// Variables for testing.
const DEBUG_NTURNS = 3;

const gameBoard = (function () {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  const mark = function (coordinates, markSymbol) {
    const [x, y] = coordinates;
    board[x][y] = markSymbol;
  };

  const cellMarked = function (coordinates) {
    // Check if the `coordinates` point to a marked cell (unmarked cells are NULL).
    // Returns a boolean. `true` if marked `false` otherwise.

    const [x, y] = coordinates;
    return board[x][y] === !null;
  };

  return { board, mark, cellMarked };
})();

function createPlayer(name, markSymbol) {
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

  return { name, markSymbol, win, getScore, resetScore };
}

const gameflow = function (playerA, playerB) {
  let currentPlayerIndex = 0;
  const players = [playerA, playerB];

  let x = 0;
  do {
    const currentPlayer = players[currentPlayerIndex];
    console.log(`${currentPlayer.name}'s turn (${currentPlayer.markSymbol})`);
    // Transform "XY" to [X int, Y int]
    const coordinates = askUserCoordinates(); // -1 is for "real" coordinates
    // since input is assuming indexed 1. (first cell is at (1, 1))

    if (gameBoard.cellMarked(coordinates)) {
      console.log(`(${coordinates.map((x) => x + 1)}) is already marked. Change location.`);
    } else {
      gameBoard.mark(coordinates, currentPlayer.markSymbol);
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

const p1 = createPlayer("Alice", "X");
const p2 = createPlayer("Bob", "O");

const btn = document.querySelector("#btn");
btn.addEventListener("click", () => {
  gameflow(p1, p2);
});
