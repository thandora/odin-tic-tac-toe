// Variables for testing.
const DEBUG_NTURNS = 5;
const WIN_COMBINATIONS = [
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
    return board[x][y] !== null;
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

  let turn = 1;
  let gameState = true;
  do {
    const currentPlayer = players[currentPlayerIndex];
    console.log(`${currentPlayer.name}'s turn (${currentPlayer.markSymbol})`);
    // Transform "XY" to [X int, Y int]
    const coordinates = askUserCoordinates();
    if (coordinates === null) {
      gameState = false;
      break;
    }
    // -1 is for "real" coordinates
    // since input is assuming indexed 1. (first cell is at (1, 1))

    if (gameBoard.cellMarked(coordinates)) {
      console.log(`(${coordinates.map((x) => x + 1)}) is already marked. Change location.`);
      continue;
    } else {
      gameBoard.mark(coordinates, currentPlayer.markSymbol);
    }

    printboard(gameBoard);
    currentPlayerIndex = switchPlayer(currentPlayerIndex);

    if (checkForWinner(gameBoard)) {
      const winner = getWinner(gameBoard, players);
      winner.win();

      console.log(`${winner.name} wins!`);
      gameState = false;
    }

    if (turn === 9) {
      console.log("ITS A DRAW!");
    }
    turn++;
  } while (gameState);

  console.log(`${playerA.name}: ${playerA.getScore()}`);
  console.log(`${playerB.name}: ${playerB.getScore()}`);

  nextGame(playerA, playerB);
};

function nextGame(...playerObjects) {
  let input;
  do {
    input = prompt(`"R" to restart game\n"E" to end game\n"C" to reset scores`);
    console.log(input);
  } while (!["r", "e", "c"].includes(input.toLowerCase()));

  if (input === "r") {
    gameflow();
  } else if (input === "c") {
    resetAllScores(...playerObjects);
    gameflow();
  }
}

function resetAllScores(...playerObjects) {
  for (const player of playerObjects) {
    player.resetScore();
  }

  console.log("Scores reset!");

  for (const player of playerObjects) {
    console.log(`${player.name}: ${player.getScore()}`);
  }
}

function switchPlayer(currentPlayerIndex) {
  currentPlayerIndex = currentPlayerIndex == 1 ? 0 : 1;
  return currentPlayerIndex;
}

function checkForWinner(gameboard) {
  for (let i = 0; i < WIN_COMBINATIONS.length; i++) {
    const cellA = gameboard.getCell(WIN_COMBINATIONS[i][0]);
    const cellB = gameboard.getCell(WIN_COMBINATIONS[i][1]);
    const cellC = gameboard.getCell(WIN_COMBINATIONS[i][2]);

    if (cellA === cellB && cellA === cellC && cellA !== null) {
      return true;
    }
  }
  return false;
}

function getWinner(gameboard, players) {
  for (let i = 0; i < WIN_COMBINATIONS.length; i++) {
    const cellA = gameboard.getCell(WIN_COMBINATIONS[i][0]);
    const cellB = gameboard.getCell(WIN_COMBINATIONS[i][1]);
    const cellC = gameboard.getCell(WIN_COMBINATIONS[i][2]);

    if (cellA === cellB && cellA === cellC && cellA !== null) {
      return players.find((player) => {
        return player.markSymbol === cellA;
      });
    }
  }
}

function askUserCoordinates() {
  let input = prompt("Coordinates: (1, 1) through (3, 3)");
  if (input !== null) {
    input = input.split("").map((x) => +x - 1);
  }

  return input;
  // -1 is for "real" coordinates
  // since input is assumed to be 1-indexed. (first cell is at (1, 1))
}

function printboard(gameboard) {
  for (let i = 0; i < gameBoard.getBoard().length; i++) {
    console.log(gameboard.getBoard()[i]);
  }
}

const p1 = createPlayer("Alice", "X");
const p2 = createPlayer("Bob", "O");

const btn = document.querySelector("#btn");
btn.addEventListener("click", () => {
  gameBoard.resetBoard();
  gameflow(p1, p2);
});
