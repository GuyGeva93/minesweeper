//https://guygeva93.github.io/minesweeper/

const MINE = '💥';
const FLAG = '🚩';
const EMPTY = '';
const GAME_ON = '😀';
const GAME_WIN = '😎';
const GAME_LOSS = '😥';

var gBoard;
var gLevel = 4;
var gGame;
var gSeconds;
var gGameTimeInterval;



function initGame() {
  gSeconds = 0;
  gGameTimeInterval = setInterval(setTime, 1000);
  gBoard = buildBoard();
  renderBoard(gBoard);
  changeSmileyState(GAME_ON);
}

//create game board
function buildBoard() {
  var SIZE = 4 //Glevel.SIZE;
  var board = [];
  for (var i = 0; i < gLevel; i++) {
    board.push([]);
    for (var j = 0; j < gLevel; j++) {
      //create manually 2 mines
      if (i === 1 && j === 1) {
        board[i][j] = createCell(minesAroundCount = 0, isShown = true, isMine = true, isMarked = false);
        continue;
      }
      if (i === 2 && j === 2) {
        board[i][j] = createCell(minesAroundCount = 0, isShown = true, isMine = true, isMarked = false);
        continue;
      }
      //create regular cell
      board[i][j] = createCell();
    }
  }
  for (i = 0; i < gLevel; i++) {
    for (j = 0; j < gLevel; j++) {
      setMinesNegsCount(board, i, j);
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

function renderBoard(board) {
  var strHtml = '';
  for (var i = 0; i < board.length; i++) {
    strHtml += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      strHtml += `<td data-i="${i}" data-j="${j}"
            class="board"
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
  if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
    elCell.innerText = gBoard[i][j].minesAroundCount;
    gBoard[i][j].isShown = true;
    checkIfWin();
  } else if (gBoard[i][j].isMine) {
    elCell.innerText = MINE;
    gameOver();
  } else if (gBoard[i][j].isMarked) {
    elCell.innerText = EMPTY;
    gBoard[i][j].isMarked = false;
  }

}

function checkIfWin() {
  console.log('checkIfWin()');
  changeSmileyState(GAME_WIN);
}

function onRightCellClicked(elCell, i, j) {
  if (gBoard[i][j].isMarked) {
    elCell.innerText = ' ';
    gBoard[i][j].isMarked = false;

  } else if (gBoard[i][j].isShown) {
    return;
  } else {
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;
  }
}

function changeSmileyState(smiley) {
  var elSpan = document.querySelector('.smiley span');
  elSpan.innerText = smiley;
}

function gameOver() {
  changeSmileyState(GAME_LOSS);
  clearInterval(gGameTimeInterval);
  console.log('Game Over');
  setTimeout(initGame, 3000);
}

function cellMarked(elCell) {

}

function setLevel(btnId) {
  if (btnId === 'level4') {
    gLevel = 4;
    clearInterval(gGameTimeInterval);
    initGame();
  } else if (btnId === 'level8') {
    gLevel = 8;
    clearInterval(gGameTimeInterval);
    initGame();
  } else if (btnId === 'level12') {
    gLevel = 12;
    clearInterval(gGameTimeInterval);
    initGame();
  }
}