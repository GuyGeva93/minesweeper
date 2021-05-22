//https://guygeva93.github.io/minesweeper/

const MINE = '💣';
const FLAG = '🚩';
const EMPTY = ' ';
const GAME_ON = '😀';
const GAME_WIN = '😎';
const GAME_LOSS = '😥';

var gBoard;
var gLevel = { level: 4, mines: 2 };
var gGame;
var gSeconds;
var gGameTimeInterval;
var gSecondsLabel = document.querySelector('.timer');
var gFirstClick = false;
var gLives = 1; //Default is level 4 with 2 mines..

function initGame() {
  gGame = true;
  gSeconds = 0;
  changeSmileyState(GAME_ON);
  gBoard = buildBoard();
  renderBoard(gBoard);
  renderLives();
}

//create game board
function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.level; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.level; j++) {
      //create regular cell
      board[i][j] = createCell();
    }
  }
  return board;
}

//cell constructor
function createCell(minesAroundCount = 0, isShown = false, isMine = false, isMarked = false) {
  var cell = {
    minesAroundCount,
    isShown,
    isMine,
    isMarked
  }
  return cell;
}

//Finding mine neighbors
function setMinesNegsCount(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[0].length) continue;
      if (board[i][j].isMine) {
        board[cellI][cellJ].minesAroundCount++;
      }
    }
  }
}

function expandShow(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= board[0].length) continue;
      if (!board[i][j].isMine) {
        var elCell = document.querySelector(`.cell-${i}-${j}`);
        gBoard[i][j].isShown = true;
        if (gBoard[i][j].minesAroundCount) {
          renderCell(elCell, gBoard[i][j].minesAroundCount);
        }
        else {
          addClasslist(elCell);
          renderCell(elCell, EMPTY);
        }
      }
    }
  }

}

//Bonus
function multiExpandShow(board, idxI, idxJ) {
  debugger;
  for (var i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = idxJ - 1; j <= idxJ + 1; j++) {
      if (i === idxI && j === idxJ) continue;
      if (j < 0 || j >= board[0].length) continue;
      expandShow(gBoard, i, j);
    }
  }
}

function renderBoard(board) {
  var strHtml = '';
  for (var i = 0; i < board.length; i++) {
    strHtml += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      strHtml += `<td " class="cell-${i}-${j}"
            onclick="cellClicked(this,${i},${j})"
            oncontextmenu="onRightCellClicked(this,${i},${j}); return false;">
            ${EMPTY}
            </td>`
    }
    strHtml += '</tr>'
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHtml;
}

function cellClicked(elCell, i, j) {
  if (!gGame) return; //unclickable if game hasn't reset by clicking on the smiley

  //Waiting for the first click to start the game time
  if (!gFirstClick) {
    addClasslist(elCell);
    gGameTimeInterval = setInterval(renderGameTime, 1000);
    gBoard[i][j].isShown = true;
    setMinesOnBoard(i, j);

    //If the first clicked cell has neighbors, only reveal him without check his negs
    if (gBoard[i][j].minesAroundCount) {
      gFirstClick = true;
      renderCell(elCell, gBoard[i][j].minesAroundCount);
      gBoard[i][j].isShown = true;
    } else multiExpandShow(gBoard, i, j); //If the first clicked cell doesn't have negs, checking his negs

  }


  if (gBoard[i][j].isShown && !gBoard[i][j].isMine) return; //Prevent from clicking on revealed cell

  if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked && gBoard[i][j].minesAroundCount) {
    renderCell(elCell, gBoard[i][j].minesAroundCount);
    gBoard[i][j].isShown = true;
    addClasslist(elCell);
    checkIfWin();

  } else if (!gBoard[i][j].minesAroundCount && !gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
    gBoard[i][j].isShown = true;
    renderCell(elCell, EMPTY);
    addClasslist(elCell);
    expandShow(gBoard, i, j);
    multiExpandShow(gBoard, i, j);
    checkIfWin();
  }
  else if (gBoard[i][j].isMine) {
    renderCell(elCell, MINE);
    gLives--;
    renderLives();
    if (gLives) {
      gBoard[i][j].isShown = true;
      checkIfWin();
      return;
    }
    else {
      var elCell = document.querySelector(`.cell-${i}-${j}`);
      elCell.classList.add('lost');
      elCell.classList.remove('hover');
      gameOver();
    }

  } else if (gBoard[i][j].isMarked) return;

}

function setMinesOnBoard(clickedI, clickedJ) {
  var randomEmptyCells = getEmptyCells(gBoard);
  randomEmptyCells = shuffle(randomEmptyCells); //Shuffle the array of empty cells to get random positions
  for (var i = 0; i < gLevel.mines; i++) {
    var randomCell = drawNum(randomEmptyCells); // Draw location from the empty cells array

    // If the random location is the user's first click, draw again
    while (randomCell.i === clickedI && randomCell.i === clickedJ) {
      randomCell = drawNum(randomEmptyCells);
    }
    renderMine(randomCell);
  }
  for (i = 0; i < gLevel.level; i++) {
    for (j = 0; j < gLevel.level; j++) {
      setMinesNegsCount(gBoard, i, j);
    }
  }
}

function renderMine(location) {
  // Update model only
  gBoard[location.i][location.j].isMine = true;
}


function renderCell(elCell, value) {
  elCell.innerText = value;
}

//Winning checks
function checkIfWin() {
  var countMines = gLevel.mines;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
        countMines--; // if user has flagged a mine, the mine counter is decrease

        // If not all of the non mine cells were revealed, user didn't win
      } else if (!(gBoard[i][j].isMine) && !(gBoard[i][j].isShown)) {
        return;
      } else if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
        countMines--;
      }
    }
  }
  if (!countMines) renderWin();
  else return;
}

function renderWin() {
  clearInterval(gGameTimeInterval);
  changeSmileyState(GAME_WIN);

}

function onRightCellClicked(elCell, i, j) {
  if (!gGame) return; //unclickable if game hasn't reset by clicking on the smiley

  if (gBoard[i][j].isMarked) {
    elCell.innerText = ' ';
    gBoard[i][j].isMarked = false;

  } else if (gBoard[i][j].isShown) {
    return;
  } else {
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;
    checkIfWin();
  }
}

function changeSmileyState(smiley) {
  var elSpan = document.querySelector('.smiley span');
  elSpan.innerText = smiley;
}

function gameOver() {
  showAllMines();
  changeSmileyState(GAME_LOSS);
  clearInterval(gGameTimeInterval);
  gGame = false;
}

function showAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine && !gBoard[i][j].isShown) {
        gBoard[i][j].isShown = true;
        var elCell = document.querySelector(`.cell-${i}-${j}`);
        renderCell(elCell, MINE);
      }
    }
  }
}


//Setting game level by user's click
//Default is 4
function setLevel(btnId) {
  if (!gGame) return; //unclickable if game hasn't reset by clicking on the smiley

  if (btnId === 'level4') {
    gLevel.level = 4;
    gLevel.mines = 2;
    clearInterval(gGameTimeInterval);
    resetGameTime();
    gFirstClick = false;
    initGame();
  } else if (btnId === 'level8') {
    gLives = 3;
    renderLives();
    gLevel.level = 8;
    gLevel.mines = 12;
    clearInterval(gGameTimeInterval);
    resetGameTime();
    gFirstClick = false;
    initGame();
  } else if (btnId === 'level12') {
    gLives = 3;
    renderLives();
    gLevel.level = 12;
    gLevel.mines = 30;
    clearInterval(gGameTimeInterval);
    resetGameTime();
    gFirstClick = false;
    initGame();
  }
}


//When pressing the emoji the game will restart
function resetGame() {
  clearInterval(gGameTimeInterval);
  resetGameTime();
  gFirstClick = false;
  gLives = (gBoard.length === 4) ? 1 : 3;
  renderLives();
  initGame();
}

//Reset the game time
function resetGameTime() {
  gSecondsLabel.innerText = '0';
}

function addClasslist(elCell) {
  elCell.classList.add('cellReveal');
}

function renderLives() {
  var elSpan = document.querySelector('.lives span');
  elSpan.innerText = gLives;
}

// function addToUndoArr(i, j, type) {
//   gUndoCells.push({ i, j, type });
// }