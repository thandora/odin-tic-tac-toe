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

    if (isBoardFull()) {
      console.log("its a draw");
      return 0;
    }
  };

  return { getBoard, mark, cellMarked, getCell, resetBoard, isBoardFull, checkBoardState };
})();

function createPlayer(name, mark) {
  let score = 0;
  const markSymbol = mark;

  const getScore = function () {
    return score;
  };

  const resetScore = function () {
    score = 0;
  };

  const win = function () {
    score++;
  };

  const getMark = function () {
    return markSymbol;
  };

  return { name, getMark, win, getScore, resetScore };
}

const game = (function () {
  const playerAName = document.querySelector(".player-name-a").textContent;
  const playerBName = document.querySelector(".player-name-b").textContent;
  const playerA = createPlayer(playerAName, "X");
  const playerB = createPlayer(playerBName, "O");
  const players = [playerA, playerB];
  let currentPlayer = players[0];
  let currentMark = currentPlayer.getMark();

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
        gameflow(cell);
      });
    }
  }

  function gameflow(cell) {
    const rawCoords = cell.getAttribute("data-coords");
    const coords = parseCoordinates(rawCoords);

    if (!checkForWinner()) {
      if (!gameboard.cellMarked(coords)) {
        gameboard.mark(coords, currentMark);
        updateCellDisplay(cell, coords, currentMark);
        switchPlayer();
      }
    }

    if (checkForWinner()) {
      let winner = getWinner(players);
      console.log(winner.name);
    }
  }

  function updateBoardDisplay() {
    // Update game board display on UI
    const board = gameboard.getBoard();

    for (const cell of cells) {
      const [x, y] = parseCoordinates(cell.getAttribute("data-coords"));
      cell.textContent = board[x][y];
    }
  }

  function updateCellDisplay(cell, coordinates) {
    cell.textContent = gameboard.getCell(coordinates);
  }

  const newGame = function () {
    currentPlayer = players[0];
    currentMark = currentPlayer.getMark();
    gameboard.resetBoard();
    updateBoardDisplay();
  };

  function getWinner(players) {
    // TODO DRY
    for (let i = 0; i < WIN_COMBINATIONS.length; i++) {
      const cellA = gameboard.getCell(WIN_COMBINATIONS[i][0]);
      const cellB = gameboard.getCell(WIN_COMBINATIONS[i][1]);
      const cellC = gameboard.getCell(WIN_COMBINATIONS[i][2]);

      if (cellA === cellB && cellA === cellC && cellA !== null) {
        return players.find((player) => {
          return player.getMark() === cellA;
        });
      }
    }
  }

  function checkForWinner() {
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

  function switchPlayer() {
    const nextPlayerIndex = players.findIndex((p) => p !== currentPlayer);
    currentPlayer = players[nextPlayerIndex];
    currentMark = currentPlayer.getMark();
  }

  return { initialize, newGame, updateBoardDisplay, updateScoreboard };
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

function printboard() {
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
