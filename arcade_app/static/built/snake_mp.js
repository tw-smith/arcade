import { gameParameters, Food, Snake } from "./classes.js";
import { socket } from "./socket.js";
export function startGame(role) {
    const SNAKE_COLOUR = "white";
    const RAMP_SPEED = 1;
    const TILE_SIZE = 20;
    const SNAKE_SIZE = 20;
    // TODO: improve canvas flexibiltiy for different game modes/map sizes
    let canvas = document.querySelector('.myCanvas');
    canvas.width = 600;
    canvas.height = 600;
    let gameModal;
    let game = new gameParameters(3, RAMP_SPEED);
    let snakes = assign_snakes(role, game);
    let food = new Food();
    addGameControls(snakes.snake);
    socket.on('updateParams', (data) => {
        recieveUpdatedParameters(data, snakes.oppo_snake, game, food);
    });
    sendUpdatedParameters(role, snakes.snake, game, food);
    gameLoop(role, snakes, game, food, canvas);
}
function assign_snakes(role, game) {
    let snakes;
    if (role == 'host') {
        let snake = new Snake('host', game);
        let oppo_snake = new Snake('client', game);
        snakes = {
            'snake': snake,
            'oppo_snake': oppo_snake
        };
    }
    if (role == 'client') {
        let snake = new Snake('client', game);
        let oppo_snake = new Snake('host', game);
        snakes = {
            'snake': snake,
            'oppo_snake': oppo_snake
        };
    }
    return snakes;
}
function addGameControls(snake) {
    document.addEventListener("keydown", parseKeyInput);
    document.getElementById("upButton").addEventListener("click", snake.move("up"));
    document.getElementById("downButton").addEventListener("click", snake.move("down"));
    document.getElementById("leftButton").addEventListener("click", snake.move("left"));
    document.getElementById("rightButton").addEventListener("click", snake.move("right"));
    function parseKeyInput(e) {
        switch (e.key) {
            case "a":
                snake.move("left");
                break;
            case "w":
                snake.move("up");
                break;
            case "d":
                snake.move("right");
                break;
            case "s":
                snake.move("down");
                break;
        }
    }
}
function sendUpdatedParameters(role, snake, game, food) {
    const packet = {
        'snake': snake,
        'gameOver': game.gameOverFlag,
        'score': game.score,
        'food': food
    };
    socket.emit('updateParameters', packet);
}
function recieveUpdatedParameters(data, oppo_snake, game, food) {
    oppo_snake.segments = [];
    for (let i = 0; i < data.snake.segments.length; i++) {
        oppo_snake.addSegment({
            x: data.snake.segments[i].x,
            y: data.snake.segments[i].y,
        });
    }
    ;
    game.oppo_score = data.score;
    game.gameOverFlag = data.gameOver;
    if ('food' in data) {
        food.x = data.food.x;
        food.y = data.food.y;
    }
}
function checkFoodCollision(snake, food, game) {
    // If hit food, add to snake and refresh food location
    if (snake.segments[0].x == food.x && snake.segments[0].y == food.y) {
        food.refresh();
        snake.addSegment({
            x: snake.segments[snake.segments.length - 1].x,
            y: snake.segments[snake.segments.length - 1].y,
        });
        game.increase_score(1);
        game.increase_speed();
    }
}
function gameLoop(role, snakes, game, food, canvas) {
    function loop() {
        let timeoutID;
        if (game.gameOverFlag) {
            clearTimeout(timeoutID);
        }
        else {
            timeoutID = setTimeout(loop, 1000 / game.render_rate);
        }
        sendUpdatedParameters(role, snakes.snake, game, food);
        renderCanvas(snakes, food, game, canvas);
    }
    loop();
}
function renderCanvas(snakes, food, game, canvas) {
    // reset canvas on each iteration
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    snakes.snake.move();
    document.getElementById("scoreHeader").innerText = "Score: " + game.score;
    for (let i = 0; i < snakes.snake.segments.length; i++) {
        snakes.snake.segments[i].draw(ctx);
    }
    // draw opposition snake
    // has to be in second loop because snakes will be different lengths
    // oppo_snake.segments.forEach((segment) => {
    //     segment.draw(ctx);
    // }); //TODO why doesnt foreach work?
    for (let i = 0; i < snakes.oppo_snake.segments.length; i++) {
        snakes.oppo_snake.segments[i].draw(ctx);
    }
    checkFoodCollision(snakes.snake, food, game);
    food.draw(ctx);
}
