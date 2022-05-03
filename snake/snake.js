let canvas, ctx;

// render refresh rate per second
const render_rate = 5;

// Set game world colours and item sizes
const BACKGROUND_COLOUR = "black";
const SNAKE_COLOUR = "white";
const SNAKE_HEAD_COLOUR = "green";
const FOOD_COLOUR = "blue";
const FOOD_SIZE = 10;
const SNAKE_SIZE = TILE_SIZE = 20;

// Set initial values
const STARTING_POSITIONS = [{x:10,y:10}, {x:9,y:10}, {x:8,y:10}];
let nextX = 1;
let nextY = 0;
let score = 0;
let setInterval_ID;
let food = {
  x: randomIntRange(2,28),
  y: randomIntRange(2,28),
};
let snake = {
  segments: STARTING_POSITIONS,
};

// Initialise canvas
function init () {
  canvas = document.querySelector('.myCanvas');
  width = canvas.width = 600;
  height = canvas.height = 600;
  ctx = canvas.getContext('2d');

  // Add eventListener for keystrokes and start game
  document.addEventListener("keydown", controls)
  setInterval_ID = gameStart(render_rate);
}


function gameStart(render_rate) {
  return setInterval(render,1000/render_rate);
}

// Listen for keystrokes and move head one tile in required direction
function controls(e) {
  switch (e.keyCode) {
    case 65:
      if (nextX != 1) {
        nextX = -1;
        nextY = 0;
        break;
      }
      break;

    case 87: // up
      if (nextY != 1) {
        nextX = 0;
        nextY = -1;
        break;
      }
      break;

    case 68: // right
      if (nextX != -1) {
        nextX = 1;
        nextY = 0;
        break;
      }
      break;

    case 83: //down
    if (nextY != -1) {
      nextX = 0;
      nextY = 1;
      break;
    }
    break;
  }
}

// Stop the game if a game over condition is reached
function gameOver(score) {
  clearInterval(setInterval_ID);
  ctx.font = "30px Monofett";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER",300, 300 )
}

function randomIntRange(min,max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function render() {
  // reset canvas on each iteration
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // write score
  ctx.font = "30px Monofett";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`,300, 30 )

  // move snake
  snake.segments.pop() //remove tail - // TODO: check if this prevents a collision detection with final tail segment
  newHeadPos = {
    x: (snake.segments[0].x + nextX),
    y: (snake.segments[0].y + nextY),
  };
  // check if snake has hit own tail
  for (var i = 0; i < snake.segments.length; i++) {
    if (newHeadPos.x == snake.segments[i].x && newHeadPos.y == snake.segments[i].y){
      gameOver(score)
    }
  }
  snake.segments.unshift(newHeadPos)


  // draw snake // TODO: see if this can be incorporated into the for loop above for DRY
  for (var i = 0; i < snake.segments.length; i++) {
    if (i==0) {
      ctx.fillStyle = SNAKE_HEAD_COLOUR;
    } else {
      ctx.fillStyle = SNAKE_COLOUR;
    }
    ctx.fillRect(snake.segments[i].x*TILE_SIZE, snake.segments[i].y*TILE_SIZE, SNAKE_SIZE, SNAKE_SIZE)
  }

  // draw Food
  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x*TILE_SIZE, food.y*TILE_SIZE, FOOD_SIZE, FOOD_SIZE)

  // If hit food, add to snake and refresh food location
  if ((snake.segments[0].x == food.x) && (snake.segments[0].y == food.y)) {
    food.x = randomIntRange(2,28);
    food.y = randomIntRange(2,28);
    snake.segments.push(snake.segments[snake.segments.length]);
    score ++;
  }

  // detect if snake has hit edge
  if ((snake.segments[0].x >= 30) ||
      (snake.segments[0].x <= 0) ||
      (snake.segments[0].y >= 30) ||
      (snake.segments[0].y <= 0)) {
    gameOver(score)
  }
}



document.addEventListener('DOMContentLoaded', init)
