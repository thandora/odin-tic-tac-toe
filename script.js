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

const gameboard = (function () {
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

  const isBoardFull = function () {
    for (const row of board) {
      for (const cell of row) {
        if (cell === null) {
          return false;
        }
      }
    }
    return true;
  };

  const checkBoardState = function (players) {
    if (checkForWinner(this)) {
      const winner = getWinner(this, players);
      winner.win();

      console.log(`${winner.name} wins!`);
      gameState = false;

      return 1;
    }

    // check if board full
    if (isBoardFull()) {
      console.log("its a draw");
      return 0;
    }
  };

  return { getBoard, mark, cellMarked, getCell, resetBoard, isBoardFull, checkBoardState };
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

const game = (function () {
  const playerAName = document.querySelector(".player-name-a").textContent;
  const playerBName = document.querySelector(".player-name-b").textContent;
  const playerA = createPlayer(playerAName, "X");
  const playerB = createPlayer(playerAName, "O");
  const currentPlayer = playerA;
  const players = [playerA, playerB];

  // UI nodes
  const UINames = [
    document.querySelector(".player-name-a"),
    document.querySelector(".player-name-b"),
  ];

  const scoreBoards = [
    document.querySelector(".player-score-a"),
    document.querySelector(".player-score-b"),
  ];

  // UI - Board cells
  const cells = document.querySelectorAll(".board .cell");

  const initialize = function () {
    // Initialize parameters.
    // Initialize player name and scores on UI.
    updateScoreboard();
    initCells();
  };

  function updateScoreboard() {
    // Update scores display on UI
    for (const [i, board] of scoreBoards.entries()) {
      board.textContent = players[i].getScore();
    }
  }

  function initCells() {
    for (const cell of cells) {
      cell.addEventListener("click", () => {
        gameboard.mark();
      });
      cell.addEventListener("click", checkBoardState);
    }
  }

  function updateBoardDisplay(board) {
    // Update game board display on UI
    for (const cell of cells) {
      const [x, y] = parseCoordinates(cell.getAttribute("data-coords"));
      cell.textContent = board[x][y];
    }
  }

  const newGame = function () {
    gameboard.resetBoard();
    updateBoardDisplay();
  };

  function getWinner(gameboard, players) {
    // TODO DRY
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

  function checkForWinner(gameboard) {
    // TODO DRY
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
  return { initialize, newGame, updateBoardDisplay, updateScoreboard };
  // ########
  // console version below this line
  // ########
  // let currentPlayerIndex = 0;
  // const players = [playerA, playerB];

  // let turn = 1;
  // let gameState = true;
  // do {
  //   const currentPlayer = players[currentPlayerIndex];
  //   console.log(`${currentPlayer.name}'s turn (${currentPlayer.markSymbol})`);
  //   // Transform "XY" to [X int, Y int]
  //   const coordinates = askUserCoordinates();
  //   if (coordinates === null) {
  //     gameState = false;
  //     break;
  //   }
  //   // -1 is for "real" coordinates
  //   // since input is assuming indexed 1. (first cell is at (1, 1))

  //   if (gameBoard.cellMarked(coordinates)) {
  //     console.log(`(${coordinates.map((x) => x + 1)}) is already marked. Change location.`);
  //     continue;
  //   } else {
  //     gameBoard.mark(coordinates, currentPlayer.markSymbol);
  //   }

  //   printboard(gameBoard);
  //   currentPlayerIndex = switchPlayer(currentPlayerIndex);

  //   checkBoardState(players);

  //   turn++;
  // } while (gameState);

  // console.log(`${playerA.name}: ${playerA.getScore()}`);
  // console.log(`${playerB.name}: ${playerB.getScore()}`);

  // nextGame(playerA, playerB);
})();

function nextGame(...playerObjects) {
  let input;
  do {
    input = prompt(`"N" for new game\n"E" to end game\n"R" to reset scores`);
    console.log(input);
  } while (!["n", "e", "r"].includes(input.toLowerCase()));

  if (input === "n" || input === "c") {
    gameboard.resetBoard();

    if (input === "c") {
      resetAllScores(...playerObjects);
    }
    gameflow(...playerObjects);
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
  for (let i = 0; i < gameboard.getBoard().length; i++) {
    console.log(gameboard.getBoard()[i]);
  }
}

const p1 = createPlayer("Alice", "X");
const p2 = createPlayer("Bob", "O");

function parseCoordinates(rawCoordinates) {
  const coordinates = [];
  rawCoordinates.split(",").forEach((x) => {
    coordinates.push(+(x - 1));
  });

  return coordinates;
}

game.initialize();
