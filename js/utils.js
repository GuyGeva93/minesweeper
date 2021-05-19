
//rendering the game time
var secondsLabel = document.querySelector('.timer');
function renderGameTime() {
  ++gSeconds;
  secondsLabel.innerHTML = gSeconds;
}

//Finding empty cells to put mines (excluding the first click)
function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (!board[i][j].isShown) {
        var emptyCell = { i, j }
        emptyCells.push(emptyCell);
      }
    }
  }
  return emptyCells;
}

function drawNum(arr) {
  return arr.pop();
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);

    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}