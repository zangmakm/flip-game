// css class for different card image
const CARD_TECHS = [
  "html5",
  "css3",
  "js",
  "sass",
  "nodejs",
  "react",
  "linkedin",
  "heroku",
  "github",
  "aws",
];

// only list out some of the properties,
// add more when needed
const game = {
  score: 0,
  level: 1,
  timer: 60,
  timerDisplay: null,
  scoreDisplay: null,
  levelDisplay: null,
  timerInterval: null,
  startButton: null,
  // and much more
  cardTotal: 0,
  gameOver: true,
  preCard: null,
  countCard: 0,
  intervalID: 0,
};

setGame();

/*******************************************
/     game process
/******************************************/
function setGame() {
  // register any element in your game object
  game.timerDisplay = document.querySelector(".game-timer");
  game.scoreDisplay = document.querySelector(".game-stats__score--value");
  game.levelDisplay = document.querySelector(".game-stats__level--value");
  game.timerInterval = document.querySelector(".game-timer__bar");
  game.startButton = document.querySelector(".game-stats__button");
  game.gameBoard = document.querySelector(".game-board");
  bindStartButton();
}

function startGame() {
  clearBoard();
  game.level = 1;
  game.score = 0;
  game.gameOver = false;
  game.levelDisplay.innerHTML = game.level;
  game.scoreDisplay.innerHTML = game.score;
  game.startButton.innerHTML = "End Game";
  generateCards();
  bindCardClick();
  startTimer();
}

function clearBoard() {
  while (game.gameBoard.firstChild) {
    game.gameBoard.removeChild(game.gameBoard.firstChild);
  }
}

function generateCards() {
  var gameBoard = game.gameBoard;
  var cardSize = game.level * 2;
  var cardTotal = cardSize * cardSize;
  game.cardTotal = cardTotal;
  const cards = [];
  gameBoard.style["grid-template-columns"] = `repeat(${cardSize}, 1fr)`;
  for (let i = 0; i < cardTotal / 2; i++) {
    const tech = CARD_TECHS[i % CARD_TECHS.length];
    const card = createNode(tech);
    cards.push(card);
    cards.unshift(card.cloneNode(true));
  }

  while (cards.length > 0) {
    const index = Math.floor(Math.random() * cards.length);
    const card = cards.splice(index, 1)[0];
    gameBoard.appendChild(card);
  }
}

function createNode(tech) {
  const node = document.createElement("div");
  const cardFront = document.createElement("div");
  const cardBack = document.createElement("div");

  node.className = "card " + tech;
  node.dataset.tech = tech;
  cardFront.className = "card__face card__face--front";
  cardBack.className = "card__face card__face--back";

  node.appendChild(cardFront);
  node.appendChild(cardBack);
  return node;
}

function handleCardFlip() {
  const cards = document.querySelectorAll(".card");

  const currentCard = this;
  if (currentCard.classList.contains("card--flipped")) {
    //debugger;
    currentCard.classList.remove("card--flipped");
    game.preCard = null;
    return;
  }
  currentCard.classList.add("card--flipped");

  if (game.preCard != null) {
    //debugger;
    if (currentCard.dataset.tech === game.preCard.dataset.tech) {
      game.countCard += 2;
      unBindCardClick(currentCard);
      unBindCardClick(game.preCard);
      game.preCard = null;
      updateScore();
      if (game.countCard === game.cardTotal) {
        stopTimer();
        setTimeout(() => {
          game.countCard = 0;
          nextLevel();
        }, 1500);
      }
    } else {
      setTimeout(() => {
        currentCard.classList.remove("card--flipped");
        game.preCard.classList.remove("card--flipped");
        game.preCard = null;
      }, 1000);
    }
    return;
  }

  game.preCard = currentCard;
}

function nextLevel() {
  if (game.level < 3) {
    game.timer = 60;
    startTimer();
    clearBoard();
    game.level += 1;
    game.levelDisplay.innerHTML = game.level;

    generateCards();
    bindCardClick();
  } else {
    endGame();
  }
}

// function handleGameOver() {}

/*******************************************
/     UI update
/******************************************/
function updateScore() {
  game.score += game.level * 2 * game.timer;
  game.scoreDisplay.innerHTML = game.score;
}

function startTimer() {
  updateTimerDisplay();
  game.intervalID = setInterval(() => {
    game.timer--;
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  if (game.timer === 0) {
    stopTimer();
    endGame();
  } else {
    game.timerInterval.innerHTML = game.timer + "s";
    game.timerInterval.style.width = (game.timer / 60) * 100 + "%";
  }
}

function stopTimer() {
  clearInterval(game.intervalID);
}

function endGame() {
  game.startButton.innerHTML = "Start Game";
  game.gameOver = true;
  game.countCard = 0;
  game.timer = 60;
  stopTimer();
  alert("Your score is : " + game.score);
}
/*******************************************
/     bindings
/******************************************/
function bindStartButton() {
  game.startButton.addEventListener("click", () => {
    if (game.gameOver) {
      startGame();
    } else {
      endGame();
    }
  });
}

function unBindCardClick(card) {
  card.removeEventListener("click", handleCardFlip);
}

function bindCardClick() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", handleCardFlip);
  });
}
