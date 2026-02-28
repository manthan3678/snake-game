const board = document.querySelector(".board");
const blockHeight = 50;
const blockWidth = 50;
const startBtn = document.querySelector(".btn-start");
const restartbtn = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModel = document.querySelector(".game-over");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
const blocks = [];

let highScore = localStorage.getItem("high-score") || 0;
let score = 0;
let time = `00-00`;
highScoreElement.innerText = highScore;
let intervelId = null;
let timerIntervalId = null;

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
let snake = [
  // x: row
  // y: col
  {
    x: 1,
    y: 3,
  },
  {
    x: 1,
    y: 4,
  },
  {
    x: 1,
    y: 5,
  },
];
let direction = "left";
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    block.innerText = `${row}${col}`;
    blocks[`${row}-${col}`] = block;
  }
}
snake.forEach((segments) => {
  blocks[`${segments.x}-${segments.y}`].classList.add("fill");
});
blocks[`${food.x}-${food.y}`].classList.add("food");

function render() {
  let head = null;
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervelId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModel.style.display = "flex";
    return;
  }
  // Add new head
  snake.unshift(head);

  if (head.x == food.x && head.y == food.y) {
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("high-score", highScore.toString());
    }
  } else {
    snake.pop();
  }

  // Clear board
  Object.values(blocks).forEach((block) => {
    block.classList.remove("fill", "food");
  });
  // Draw snake
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });

  // Draw food
  blocks[`${food.x}-${food.y}`].classList.add("food");
}

startBtn.addEventListener("click", () => {
  clearInterval(timerIntervalId);
  clearInterval(intervelId);
  modal.style.display = "none";
  intervelId = setInterval(() => {
    render();
  }, 300);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    sec++;

    if (sec === 60) {
      min++;
      sec = 0;
    }

    if (sec < 10) sec = "0" + sec;
    if (min < 10) min = "0" + min;

    time = min + "-" + sec;
    timeElement.innerText = time;
    console.log(timeElement);
    console.log(time);
  }, 1000);
});

restartbtn.addEventListener("click", restartGame);
function restartGame() {
  score = 0;
  scoreElement.innerText = score;

  time = `00-00`;
  highScoreElement.innerText = highScore;

  modal.style.display = "none";
  snake = [{ x: 2, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  intervelId = setInterval(() => {
    render();
  }, 300);
}

addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    direction = "up";
  } else if (event.key === "ArrowDown") {
    direction = "down";
  } else if (event.key === "ArrowRight") {
    direction = "right";
  } else if (event.key === "ArrowLeft") {
    direction = "left";
  }
});
