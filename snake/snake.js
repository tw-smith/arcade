let canvas, ctx;

// render refresh rate per second
let render_rate = 5;

// Set game world colours
const BACKGROUND_COLOUR = "black";
const SNAKE_COLOUR = "white";
const FOOD_COLOUR = "blue";

const FOOD_SIZE = 10;
const SNAKE_SIZE = 20;
let STARTING_POSITIONS = [{x:10,y:10}, {x:9,y:10}, {x:8,y:10}];
var nextX = 1;
var nextY = 0;
var tile_size = 20;
var score = 0;
var setInterval_ID;

var food = {
  x: Math.floor(Math.random() * tile_size),
  y: Math.floor(Math.random() * tile_size),
};

var snake = {
  segments: STARTING_POSITIONS
};


function init () {
  canvas = document.querySelector('.myCanvas');
  width = canvas.width = 600;
  height = canvas.height = 600;
  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  document.addEventListener("keydown", controls)
  setInterval_ID = game_start(render_rate);


}


function game_start(render_rate) {
  return setInterval(render,1000/render_rate);
}


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

function game_over(score) {
  clearInterval(setInterval_ID);
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER",300, 300 )
}





function render() {
  // reset canvas on each iteration
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // write score
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`,300, 30 )

  // move snake
 snake.segments.pop()
  newHeadPos = {
    x: (snake.segments[0].x + nextX),
    y: (snake.segments[0].y + nextY),
  };
  // check if snake has hit own tail
  for (var i = 0; i < snake.segments.length; i++) {
    if (newHeadPos.x == snake.segments[i].x && newHeadPos.y == snake.segments[i].y){
      game_over(score)
    }
  }
  snake.segments.unshift(newHeadPos)


  // draw snake
  for (var i = 0; i < snake.segments.length; i++) {
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.fillRect(snake.segments[i].x*tile_size, snake.segments[i].y*tile_size, SNAKE_SIZE, SNAKE_SIZE)
  }

  // draw Food
  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x*tile_size, food.y*tile_size, FOOD_SIZE, FOOD_SIZE)

  // add to snake
  if ((snake.segments[0].x == food.x) && (snake.segments[0].y == food.y)) {
    food.x = Math.floor(Math.random() * tile_size);
    food.y = Math.floor(Math.random() * tile_size);
    snake.segments.push(snake.segments[snake.segments.length]);
    score ++;
  }

  // detect if snake has hit edge
  if ((snake.segments[0].x >= 30) ||
      (snake.segments[0].x <= 0) ||
      (snake.segments[0].y >= 30) ||
      (snake.segments[0].y <= 0)) {
    game_over(score)
  }
}



document.addEventListener('DOMContentLoaded', init)
