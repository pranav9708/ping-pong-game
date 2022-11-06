var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");
var ball = document.getElementById("ball");
var scoreText = document.getElementById("score");

let gameOn = false;
let ballSpeedX = 2,
  ballSpeedY = 2;
let score, maxScore, moveball, rod;

const storeName = "Rod1";
const storeScore = "100";
const rod1Name = "Rod 1";
const rod2Name = "Rod 2";

// IIFE to get current highest score,playername and resetboard to starting condition.
(function () {
  rod = localStorage.getItem(storeName);
  maxScore = localStorage.getItem(storeScore);
  if (rod === null || maxScore === null) {
    alert("This is the first time you are playing this game. All the best!");
    maxScore = 0;
    rod = "rod1";
  } else {
    alert(rod + " has maximum score of " + maxScore * 100);
  }
  resetBoard(rod);
})();

//function to reset board to initial state
function resetBoard(rodName) {
  rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + "px";
  rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + "px";
  ball.style.left = (window.innerWidth - ball.offsetWidth) / 2 + "px";

  // Lossing player gets the ball
  if (rodName === rod2Name) {
    ball.style.top = rod1.offsetTop + rod1.offsetHeight + "px";
    ballSpeedY = 2; //chaning ball direction to go down
  } else if (rodName === rod1Name) {
    ball.style.top = rod2.offsetTop - rod2.offsetHeight + "px";
    ballSpeedY = -2; //changing ball direction to go up
  }
  scoreText.innerText = 0;
  score = 0;
  gameOn = false;
}

//function to store winning player and score if it is the highest and show the winning player and score
function storeWin(rod, score) {
  scoreText.innerText = score * 100;
  if (score > maxScore) {
    maxScore = score;
    localStorage.setItem(storeName, rod);
    localStorage.setItem(storeScore, maxScore);
  }

  clearInterval(moveball);
  setTimeout(function () {
    alert(
      `${rod} wins with a score of ${score * 100}. Max score is:${
        maxScore * 100
      }`
    );
  }, 10);
  resetBoard(rod);
}

//main function where collision detection,movement of ball and rod logic is written
window.addEventListener("keydown", function () {
  let rodSpeed = 20;

  let rodRect = rod1.getBoundingClientRect();

  //moving the rods based on user input of d and a keys
  //checking if rod is going out of right side of screen
  if (event.code === "KeyD" && rodRect.x + rodRect.width < window.innerWidth) {
    rod1.style.left = rodRect.x + rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  } //checking if rod is going out of left side of screen
  else if (event.code === "KeyA" && rodRect.x > 0) {
    rod1.style.left = rodRect.x - rodSpeed + "px";
    rod2.style.left = rod1.style.left;
  }

  //game starts and ball starts moving
  if (event.code === "Enter") {
    gameOn = true;
    let ballRect = ball.getBoundingClientRect();
    let ballX = ballRect.x;
    let ballY = ballRect.y;
    let ballDia = ballRect.width;

    let rod1Height = rod1.offsetHeight;
    let rod2Height = rod2.offsetHeight;
    let rod1Width = rod1.offsetWidth;
    let rod2Width = rod2.offsetWidth;

    moveball = setInterval(function () {
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      let rod1X = rod1.getBoundingClientRect().x;
      let rod2X = rod2.getBoundingClientRect().x;

      ball.style.left = ballX + "px";
      ball.style.top = ballY + "px";
      //checking if ball is touching left and right side of screen
      if (ballX + ballDia > window.innerWidth || ballX < 0) {
        ballSpeedX = -ballSpeedX;
      }

      let ballPos = ballX + ballDia / 2;

      //check for rod1
      if (ballY <= rod1Height) {
        ballSpeedY = -ballSpeedY; // Reverses the direction
        score++;
        scoreText.innerText = score * 100;

        //checking whether ball is touching rod1 if not rod1 loses the game
        if (ballPos < rod1X || ballPos > rod1X + rod1Width) {
          storeWin(rod2Name, score);
          console.log("rod2 wins");
        }
      }
      //check for rod2
      else if (ballY + ballDia >= window.innerHeight - rod2Height) {
        ballSpeedY = -ballSpeedY; // Reverses the direction
        score++;
        scoreText.innerText = score * 100;

        //checking whether ball is touching rod2 if not rod2 loses the game
        if (ballPos < rod2X || ballPos > rod2X + rod2Width) {
          storeWin(rod1Name, score);
          console.log("rod1 wins");
        }
      }
    }, 10);
  }
});
