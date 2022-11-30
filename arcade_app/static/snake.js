let canvas, ctx;
let f = new FontFace('press start', 'url(assets/Press_Start_2P/PressStart2P-Regular.ttf)');
f.load().then(function(font){
  document.fonts.add(font);
})

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', '${vh}px');


// render refresh rate per second
let render_rate = 5;
const rampSpeed = 1;
let gameOverFlag = false;

// Set game world colours and item sizes
const BACKGROUND_COLOUR = "black";
const SNAKE_COLOUR = "white";
const SNAKE_HEAD_COLOUR = "green";
const FOOD_COLOUR = "blue";
const FOOD_SIZE = 10;
const SNAKE_SIZE = TILE_SIZE = 20;
const EMOJI_THRESHOLDS = [0, 12, 16, 20, 24];

// Set initial values
const STARTING_POSITIONS = [{x:10,y:10}, {x:9,y:10}, {x:8,y:10}];
let nextX = 1;
let nextY = 0;
let score = 0;
let setInterval_ID;
let timeoutID;
let food = {
  x: randomIntRange(2,28),
  y: randomIntRange(2,28),
};
let snake = {
  segments: STARTING_POSITIONS,
};
let dir = ""

// Get DOM elements
let startModal = document.getElementById("startModal");
let scoreModal = document.getElementById("scoreModal");
let scoreHeader = document.getElementById("scoreHeader");
let scoreEmoji = document.getElementById("scoreEmoji");


// Initialise canvas
function init () {
  startModal.style.display = "none";
  canvas = document.querySelector('.myCanvas');
  width = canvas.width = 600;
  height = canvas.height = 600;
  ctx = canvas.getContext('2d');

  // Add eventListener for keystrokes and start game
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
  //setInterval_ID = gameStart(render_rate);
  gameStart();
}


function gameStart () {
  function loop() {
    render();
    if(gameOverFlag) {
      clearTimeout(timeoutID)
    } else {
      timeoutID = setTimeout(loop, 1000/render_rate)
    }
  }
  loop();  
}





//function gameStart(render_rate) {
  //return setInterval(render,1000/render_rate);
 // var renderSpeed = function() {
  //  if (score%2 == 0) {
   //   render_rate += 5
    //}
    //setTimeout(render, 1000/render_rate)
  //}
  //setTimeout(renderSpeed, 1000/render_rate)
//}



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

async function postScore() {
  let form = document.forms.scoreForm;
  //let form = document.getElementById("scoreForm")
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
    getHighScores()
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
    displayHighScores(output)
  } else {
    console.log("get response not ok")
  }
}


const removeChildElements = (parent) => {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};

function backButtonFunc() {
  removeChildElements(scoreModal)
  
  scoreModal.style.display = "none";
  startModal.style.display = "flex";
}


function displayHighScores(highScores) {
  if (window.getComputedStyle(startModal).display != "none") {
    startModal.style.display = "none"
  }

  const backButton = document.createElement("button");
  backButton.className = "menuButton"


  backButton.innerHTML = "Back"
  backButton.setAttribute("onclick", "backButtonFunc()");

  var list = document.createElement("ul");
  list.className = "modal__scoreList"
  for (let i of highScores) {
    var nameSpan = document.createElement("span");
    var scoreSpan = document.createElement("span");
    var item = document.createElement("li");
    nameSpan.innerHTML = i.user_name + ": ";
    scoreSpan.innerHTML = i.score;
    item.appendChild(nameSpan)
    item.appendChild(scoreSpan)
    list.appendChild(item);
  }
  scoreModal.appendChild(list);
  scoreModal.appendChild(backButton);
  document.getElementById("modal").style.display = "none";
  scoreModal.style.display = "flex";
}






// Listen for keystrokes and move head one tile in required direction
function controls(dir) {
  
  switch (dir) {
    case "left":
      if (nextX != 1) {
        nextX = -1;
        nextY = 0;
        break;
      }
      break;

    case "up": // up
      if (nextY != 1) {
        nextX = 0;
        nextY = -1;
        break;
      }
      break;

    case "right": // right
      if (nextX != -1) {
        nextX = 1;
        nextY = 0;
        break;
      }
      break;

    case "down": //down
    if (nextY != -1) {
      nextX = 0;
      nextY = 1;
      break;
    }
    break;
  }
  //window.navigator.vibrate(100);
}





// Stop the game if a game over condition is reached
function gameOver(score) {
  gameOverFlag = true;
  clearTimeout(timeoutID)
  //clearInterval(setInterval_ID);
  ctx.font = "30px Monofett";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER",300, 300)




  
  document.getElementById("modal").style.display = "flex";






}

function randomIntRange(min,max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function render() {
  // reset canvas on each iteration
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.fillRect(0, 0, width, height);

  // write score
  scoreHeader.innerHTML = "Score: " + score;
  //ctx.font = "30px press start"
  //ctx.textAlign = "center";
  //ctx.fillStyle = "white";
  //ctx.fillText(`Score: ${score}`,300, 30 )


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
    render_rate += rampSpeed;
    if (score >= EMOJI_THRESHOLDS[4]) {
      scoreEmoji.innerHTML = "&#129327";
    } else if (score >= EMOJI_THRESHOLDS[3]) {
      scoreEmoji.innerHTML = "&#129397";
    } else if (score >= EMOJI_THRESHOLDS[2]) {
      scoreEmoji.innerHTML = "&#128560"
    } else if (score >= EMOJI_THRESHOLDS[1]) {
      scoreEmoji.innerHTML = "&#128556";
    }
    //window.navigator.vibrate(200);
  }

  // detect if snake has hit edge
  if ((snake.segments[0].x >= 30) ||
      (snake.segments[0].x <= 0) ||
      (snake.segments[0].y >= 30) ||
      (snake.segments[0].y <= 0)) {
    gameOver(score)
  }
}



//document.addEventListener('DOMContentLoaded', init)
document.addEventListener('DOMContentLoaded', () => startModal.style.display = "flex");
