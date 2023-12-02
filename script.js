// Variables for testing.
const DEBUG_NTURNS = 5;

const gameBoard = (function () {
  let board = [
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

  const getBoard = function () {
    return board;
  };

  const getCell = function (coordinates) {
    const [x, y] = coordinates;
    return board[x][y];
  };

  const resetBoard = function () {
    board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  };

  return { getBoard, mark, cellMarked, getCell, resetBoard };
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
    const coordinates = askUserCoordinates();
    // -1 is for "real" coordinates
    // since input is assuming indexed 1. (first cell is at (1, 1))

    if (gameBoard.cellMarked(coordinates)) {
      console.log(`(${coordinates.map((x) => x + 1)}) is already marked. Change location.`);
    } else {
      gameBoard.mark(coordinates, currentPlayer.markSymbol);
    }

    console.log(checkForWinner(gameBoard));
    currentPlayerIndex = currentPlayerIndex == 1 ? 0 : 1;
    x++;
    console.log(gameBoard.board);
  } while (x < DEBUG_NTURNS);
};

function checkForWinner(gameboard) {
  const winCombinations = [
    // Horizontal combinations
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // Vertical combinations
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // Diagonal
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [2, 0],
      [1, 1],
      [0, 2],
    ],
  ];

  for (let i = 0; i < winCombinations.length; i++) {
    const cellA = gameboard.getCell(winCombinations[i][0]);
    const cellB = gameboard.getCell(winCombinations[i][1]);
    const cellC = gameboard.getCell(winCombinations[i][2]);

    if (cellA === cellB && cellA === cellC && cellA !== null) {
      return true;
    }
  }
  return false;
}

// Helper functions
function askUserCoordinates() {
  return prompt("Coordinates: (1, 1) through (3, 3)")
    .split("")
    .map((x) => +x - 1);
  // -1 is for "real" coordinates
  // since input is assumed to be 1-indexed. (first cell is at (1, 1))
}

const p1 = createPlayer("Alice", "X");
const p2 = createPlayer("Bob", "O");

const btn = document.querySelector("#btn");
btn.addEventListener("click", () => {
  gameflow(p1, p2);
});
