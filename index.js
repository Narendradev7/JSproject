const gridContainer = document.querySelector(".grid-container");
let cards = [];
let score = 0;
let timer;
let seconds = 60;
let remainingPairs;

document.querySelector(".score").textContent = score;

const cardData = [
  { "image": "./grapes.png", "name": "grapes" },
  { "image": "./lemon.png", "name": "lemon" },
  { "image": "./orange.png", "name": "orange" },
  { "image": "./strawberry.png", "name": "strawberry" },
  { "image": "./tomato.png", "name": "tomato" },
  { "image": "./watermelon.png", "name": "watermelon" }
];

cards = [...cardData, ...cardData];
remainingPairs = cards.length / 2;
shuffleCards();
generateCards();
startTimer();

function startTimer() {
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  seconds--;
  const timerDisplay = document.querySelector(".timer");
  if (seconds < 10) {
    timerDisplay.textContent = "0" + seconds;
  } else {
    timerDisplay.textContent = seconds;
  }

  if (seconds <= 15) {
    timerDisplay.style.color = "red";
  }

  if (seconds === 0) {
    clearInterval(timer);
    timerDisplay.textContent = "00";
    setTimeout(() => {
      alert(`Time's up! Your score is ${score}. Please click on restart to play again.`);
      restart();
    }, 1000);
  }
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", () => flipCard(cardElement)); 
  }
}

let firstCard;
let secondCard;
let lockBoard = false;
function flipCard(card) {
  if (lockBoard || firstCard === card) return;

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  const firstCardName = firstCard.getAttribute("data-name");
  const secondCardName = secondCard.getAttribute("data-name");

  if (firstCardName === secondCardName) {
    score++;
    document.querySelector(".score").textContent = score;
    updateScoreColor(score);
    disableCards();
    playSuccessSound();
    remainingPairs--;

    if (score === 6) {
      clearInterval(timer);
      setTimeout(() => {
        alert("Hurry! You have won the game. Click OK to restart.");
        restart();
      }, 500);
    }
  } else {
    unflipCards();
    playFailSound();
  }
}

function disableCards() {
  toggleCardInteraction(false);
  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  clearInterval(timer);
  resetBoard();
  shuffleCards();
  score = 0;
  seconds = 60;
  document.querySelector(".score").textContent = score;
  document.querySelector(".timer").textContent = "00";
  document.querySelector(".timer").style.color = "white";
  gridContainer.innerHTML = "";
  generateCards();
  startTimer();
}

function playSuccessSound() {
  const successSound = document.getElementById("successSound");
  successSound.play();
}

function playFailSound() {
  const failSound = document.getElementById("failSound");
  failSound.play();
}

function updateScoreColor(score) {
  const scoreElement = document.querySelector(".score");
  if (score <= 2) {
    scoreElement.style.color = "red";
  } else if (score <= 4) {
    scoreElement.style.color = "orange";
  } else {
    scoreElement.style.color = "green";
  }
}

function toggleCardInteraction(enable) {
  if (enable) {
    firstCard.addEventListener("click", () => flipCard(firstCard));
    secondCard.addEventListener("click", () => flipCard(secondCard));
  } else {
    firstCard.removeEventListener("click", () => flipCard(firstCard));
    secondCard.removeEventListener("click", () => flipCard(secondCard));
  }
}

var mcgElement = document.getElementById('mcg');
var originalText = mcgElement.innerText;

mcgElement.addEventListener('mouseover', function () {
  this.innerText = "Matching Card Game";
});

mcgElement.addEventListener('mouseout', function () {
  this.innerText = originalText;
});
