
let f = new FontFace('press start', 'url(assets/Press_Start_2P/PressStart2P-Regular.ttf)');
f.load().then(function(font){
  document.fonts.add(font);
})

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', '${vh}px');

let canvas, ctx;
let gameModal
const STARTING_POSITIONS = [{x:10,y:10}, {x:9,y:10}, {x:8,y:10}];
const SNAKE_COLOUR = "white"
const rampSpeed = 1;
const TILE_SIZE = SNAKE_SIZE = 20;
const EMOJI_THRESHOLDS = [0, 12, 16, 20, 24];
let timeoutID;
let dir = ""

// Get DOM elements
let scoreHeader = document.getElementById("scoreHeader");
let scoreEmoji = document.getElementById("scoreEmoji");

class gameParameters {
  constructor(nextX, nextY, render_rate) {
    this.BACKGROUND_COLOUR = "black";
    this.SNAKE_COLOUR = "white";
    this.SNAKE_HEAD_COLOUR = "green";
    this.gameOverFlag = false;
    this.score = 0;
    this.nextX = nextX;
    this.nextY = nextY;
    this.render_rate = render_rate;
  };

  increase_score(score_increase) {
    this.score += score_increase;
  }

  increase_speed(ramp_rate) {
    this.render_rate += ramp_rate;
  }
}

class Modal {
  constructor(element) {
    this.modal = element;
    this.show()
  }

  clear() {
    removeChildElements(this.modal)
  }

  hide() {
    this.modal.style.display = "none";
  }

  show() {
    this.modal.style.display = "flex";
  }

  async update(option) {
    this.clear()
    switch(option) {
      case "gameOver":
        const gameOverHeader = document.createElement("h2");
        const scoreForm = document.createElement("form");
        const nameInput = document.createElement("input");
        const postScoreButton = document.createElement("button");
        const playAgainButton = document.createElement("button");
  
        gameOverHeader.className = "gameOver__title";
        gameOverHeader.innerText = "Game Over!";
        scoreForm.name = "scoreForm";
        scoreForm.className = "scoreForm";
        nameInput.name = "username";
        nameInput.type = "text";
        postScoreButton.className = "menuButton";
        postScoreButton.type = "button";
        postScoreButton.onclick = postScore;
        postScoreButton.innerText = "Submit Score";
        playAgainButton.className = "menuButton";
        playAgainButton.type = "button";
        playAgainButton.onclick = startGame;
        playAgainButton.innerText = "Play Again";
  
        scoreForm.appendChild(nameInput)
        scoreForm.appendChild(postScoreButton)
        scoreForm.appendChild(playAgainButton)
        this.modal.appendChild(gameOverHeader)
        this.modal.appendChild(scoreForm)

        break
      case "startGame":
        const startHeader = document.createElement("h2");
        const startEmoji = document.createElement("h2");
        const startButton = document.createElement("button");
        const highScoreButton = document.createElement("button");
  
        startHeader.className = "startModal__title gradient";
        startHeader.innerText = "Snake";
        startEmoji.className = "startModal__title";
        startEmoji.innerHTML = '&#128013';
  
        startButton.className = "menuButton";
        startButton.type = "button";
        startButton.innerText = "Start";
        startButton.onclick = startGame;
  
        highScoreButton.className = "menuButton";
        highScoreButton.type = "button";
        highScoreButton.innerText = "High Scores"
        highScoreButton.onclick = function () {
          gameModal.update("highScores")
        };
  
        this.modal.appendChild(startHeader)
        this.modal.appendChild(startEmoji)
        this.modal.appendChild(startButton)
        this.modal.appendChild(highScoreButton)
        break
      case "highScores":
        const backButton = document.createElement("button");
        backButton.className = "menuButton"
        backButton.innerText = "Back"
        backButton.onclick = function () {
          gameModal.update("startGame")
        };
        let list = document.createElement("ul");
        list.className = "modal__scoreList"
  
        let highScores = await getHighScores();
        for (let i of await highScores) {
          const nameSpan = document.createElement("span");
          const scoreSpan = document.createElement("span");
          const item = document.createElement("li");
          nameSpan.innerHTML = i.user_name + ": ";
          scoreSpan.innerHTML = i.score;
          item.appendChild(nameSpan)
          item.appendChild(scoreSpan)
          list.appendChild(item);
        }
        this.modal.appendChild(list);
        this.modal.appendChild(backButton);
        break
    }
    this.show()
  }

}

class gameElement {
  constructor (x, y, sizeX, sizeY, colour) {
    this.x = x;
    this.y = y;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.fillColour = colour;
  }

  draw(ctx) {
    ctx.fillStyle = this.fillColour;
    ctx.fillRect(this.x*TILE_SIZE, this.y*TILE_SIZE, this.sizeX, this.sizeY);
  }

}

class Food extends gameElement {
  constructor() {
    super(randomIntRange(2,28), randomIntRange(2,28), 10, 10, "blue")
  }

  refresh() {
    this.x = randomIntRange(2,28);
    this.y = randomIntRange(2,28);
  }
}

class snakeBodyElement extends gameElement {
  constructor(x, y, colour) {
    super(x, y, SNAKE_SIZE, SNAKE_SIZE, colour)
  }
}

class Snake {
  constructor (STARTING_POSITIONS) {
    this.segments = [];
    STARTING_POSITIONS.forEach(bodySegment => {
      this.addSegment(bodySegment)
    });
    };

  addSegment(position) {
    let newSegment = new snakeBodyElement(position.x,position.y, SNAKE_COLOUR);
    this.segments.push(newSegment);
  }

  move(nextX, nextY) {
      // move snake
    this.segments.pop() //remove tail - // TODO: check if this prevents a collision detection with final tail segment
    let newHeadPos = {
      x: (this.segments[0].x + nextX),
      y: (this.segments[0].y + nextY),
    };
      // check if snake has hit own tail
    for (var i = 0; i < this.segments.length; i++) {
      if (newHeadPos.x == this.segments[i].x && newHeadPos.y == this.segments[i].y){
        gameOver(game.score)
      }
    }

   this.segments.unshift(new snakeBodyElement(newHeadPos.x, newHeadPos.y, SNAKE_COLOUR))
    // detect if snake has hit edge
    if ((this.segments[0].x >= 30) ||
        (this.segments[0].x <= 0) ||
        (this.segments[0].y >= 30) ||
        (this.segments[0].y <= 0)) {
          gameOver(game.score)
        }
  }
}




function initaliseGameParameters () {
  render_rate = 5;
  game = new gameParameters(1, 0, 5)
}

function initialiseCanvas () {
  canvas = document.querySelector('.myCanvas');
  width = canvas.width = 600;
  height = canvas.height = 600;
  ctx = canvas.getContext('2d');
}

function addControlsEventListeners () {
  document.addEventListener("keydown", parseKeyInput);
  document.getElementById("upButton").addEventListener("click", function() {
    controls("up")
  });
  document.getElementById("downButton").addEventListener("click", function() {
    controls("down")
  });
  document.getElementById("leftButton").addEventListener("click", function() {
    controls("left")
  });
  document.getElementById("rightButton").addEventListener("click", function() {
    controls("right")
  });
}

function parseKeyInput(e) {
  switch (e.keyCode){
    case 65:
      dir = "left";
      break;
    case 87:
      dir = "up";
      break;
    case 68:
      dir = "right";
      break;
    case 83:
      dir = "down";
      break;
  }
  controls(dir)
}

// Listen for keystrokes and move head one tile in required direction
function controls(dir) {
  
  switch (dir) {
    case "left":
      if (game.nextX != 1) {
        game.nextX = -1;
        game.nextY = 0;
        break;
      }
      break;

    case "up":
      if (game.nextY != 1) {
        game.nextX = 0;
        game.nextY = -1;
        break;
      }
      break;

    case "right":
      if (game.nextX != -1) {
        game.nextX = 1;
        game.nextY = 0;
        break;
      }
      break;

    case "down":
    if (game.nextY != -1) {
      game.nextX = 0;
      game.nextY = 1;
      break;
    }
    break;
  }
  //window.navigator.vibrate(100);
}


function gameLoop () {
  function loop() {
    if(game.gameOverFlag) {
      clearTimeout(timeoutID)
    } else {
      timeoutID = setTimeout(loop, 1000/game.render_rate)
    }
    render();
  }
  loop();  
}

function startGame () {
  initialiseCanvas()
  snake = new Snake(STARTING_POSITIONS)
  food = new Food;
  game = new gameParameters(1, 0, 5);
  
  addControlsEventListeners()
  gameModal.hide()
  gameLoop()
}

// Stop the game if a game over condition is reached
function gameOver(score) {
  game.gameOverFlag = true;
  gameModal.update("gameOver")
}

const removeChildElements = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

async function postScore() {
  let form = document.forms.scoreForm;
  const formData = { username: form.username.value,
                     score: score};

  let response = await fetch('/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  console.log(response)
  if (response.ok) {
    gameModal.update("highScores")
  } else {
    console.log("post response not ok")
  }
}

async function getHighScores() {
  let response = await fetch('/score', {
    method: 'GET'
  })
  if (response.ok) {
    let output = await response.json();
    console.log(output)
    return output;
  } else {
    console.log("get response not ok")
  }
}

function randomIntRange(min,max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function render() {
  // reset canvas on each iteration
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // write score
  scoreHeader.innerHTML = "Score: " + game.score;
  snake.move(game.nextX, game.nextY)

  // draw snake // TODO: see if this can be incorporated into the for loop above for DRY
  for (var i = 0; i < snake.segments.length; i++) {
   snake.segments[i].draw(ctx);
  }

  // draw Food
  food.draw(ctx);

  // If hit food, add to snake and refresh food location
  if ((snake.segments[0].x == food.x) && (snake.segments[0].y == food.y)) {

    food.refresh()
    snake.addSegment(snake.segments[snake.segments.length - 1].x, snake.segments[snake.segments.length - 1].y)
    game.increase_score(1);
    game.increase_speed(rampSpeed);

    if (game.score >= EMOJI_THRESHOLDS[4]) {
      scoreEmoji.innerHTML = "&#129327";
    } else if (game.score >= EMOJI_THRESHOLDS[3]) {
      scoreEmoji.innerHTML = "&#129397";
    } else if (game.score >= EMOJI_THRESHOLDS[2]) {
      scoreEmoji.innerHTML = "&#128560"
    } else if (game.score >= EMOJI_THRESHOLDS[1]) {
      scoreEmoji.innerHTML = "&#128556";
    }
    //window.navigator.vibrate(200);
  }


}

document.addEventListener('DOMContentLoaded', () => {
  gameModal = new Modal(document.getElementById("modal"));
});
