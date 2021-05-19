
//rendering the game time
var secondsLabel = document.querySelector('.timer');
function renderGameTime() {
  ++gSeconds;
  secondsLabel.innerHTML = gSeconds;
}
