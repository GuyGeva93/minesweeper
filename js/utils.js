
//setting the game time
var secondsLabel = document.querySelector('.timer');
function setTime() {
  ++gSeconds;
  secondsLabel.innerHTML = gSeconds;
}
