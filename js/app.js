var gBoard;
var gLevel;
var gGame;



function initGame() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  //console.log(gBoard);
}

//create game board
function buildBoard() {
  var SIZE = 4 //Glevel.SIZE;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      //create manually 2 mines
      if (i === 1 && j === 1) {
        board[i][j] = createCell(minesAroundCount = 4, isShown = true, isMine = true, isMarked = false);
        continue;
      }
      if (i === 2 && j === 2) {
        board[i][j] = createCell(minesAroundCount = 4, isShown = true, isMine = true, isMarked = false);
        continue;
      }
      //create regular cell
      board[i][j] = createCell();
    }
  }
  return board;
}

//cell constructor
function createCell(minesAroundCount = 4, isShown = true, isMine = false, isMarked = false) {
  var cell = {
    minesAroundCount,
    isShown,
    isMine,
    isMarked
  }
  return cell;
}

function setMinesNegsCount(board) {

}

function renderBoard(board) {
  var strHtml = '';
  for (var i = 0; i < board.length; i++) {
    strHtml += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      strHtml += `<td data-i="${i}" data-j="${j}"
            class="board"
            onclick="cellClicked(this,${i},${j})">
            ${board[i][j].minesAroundCount}</td>`
    }
    strHtml += '</tr>'
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHtml;
}

// strHtml += `<td data-i="${i}" data-j="${j}"
//             class="${className}"
//             onclick="cellClicked(this,${i},${j})">${board[i][j]}</td>`
//     }

function cellClicked(elCell, i, j) {

}

function cellMarked(elCell) {

}