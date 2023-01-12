import { gameParameters, Food, Snake } from "./classes.js";
import { socket } from "./socket.js";
export function startGame(role) {
    let scoreHeader = document.getElementById("scoreHeader");
    let scoreEmoji = document.getElementById("scoreEmoji");
    const SNAKE_COLOUR = "white";
    const rampSpeed = 1;
    const TILE_SIZE = 20;
    const SNAKE_SIZE = 20;
    const EMOJI_THRESHOLDS = [0, 12, 16, 20, 24]; // TODO move all this stuff
    // TODO: improve canvas flexibiltiy for different game modes/map sizes
    let canvas = document.querySelector('.myCanvas');
    canvas.width = 600;
    canvas.height = 600;
    let gameModal;
    let game = new gameParameters(3);
    let snakes = assign_snakes(role, game);
    let food = new Food();
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
    function update_params(role) {
        let packet = {
            // 'snake': snakes.snake.segments,
            'snake': snakes.snake,
            'gameOver': game.gameOverFlag,
            'score': game.score,
            'food': food
        };
        socket.emit('updateParams', packet);
    }
    socket.on('updateParams', (data) => {
        receive_params(data);
    });
    function receive_params(data) {
        // Easier to just wipe oppo_snake segments than mess around checking lengths etc
        snakes.oppo_snake.segments = [];
        for (let i = 0; i < data.snake.segments.length; i++) {
            snakes.oppo_snake.addSegment({
                x: data.snake.segments[i].x,
                y: data.snake.segments[i].y
            });
        }
        game.oppo_score = data.score;
        game.gameOverFlag = data.gameOver;
        if ('food' in data) {
            food.x = data.food.x;
            food.y = data.food.y;
        }
    }
    document.addEventListener("keydown", parseKeyInput);
    document.getElementById("upButton").addEventListener("click", function () {
        snakes.snake.direction = "up";
    });
    document.getElementById("downButton").addEventListener("click", function () {
        snakes.snake.direction = "down";
    });
    document.getElementById("leftButton").addEventListener("click", function () {
        snakes.snake.direction = "left";
    });
    document.getElementById("rightButton").addEventListener("click", function () {
        snakes.snake.direction = "right";
    });
    function parseKeyInput(e) {
        switch (e.key) {
            case "a":
                snakes.snake.direction = "left";
                break;
            case "w":
                snakes.snake.direction = "up";
                break;
            case "d":
                snakes.snake.direction = "right";
                break;
            case "s":
                snakes.snake.direction = "down";
                break;
        }
    }
    update_params(role);
    gameLoop();
    function gameLoop() {
        function loop() {
            let timeoutID;
            if (game.gameOverFlag) {
                clearTimeout(timeoutID);
            }
            else {
                timeoutID = setTimeout(loop, 1000 / game.render_rate);
            }
            update_params(role);
            console.log(snakes);
            render(snakes.snake, snakes.oppo_snake, food, canvas);
        }
        loop();
    }
    function render(snake, oppo_snake, food, canvas) {
        // reset canvas on each iteration
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // update
        snake.move();
        // write score
        scoreHeader.innerHTML = "Score: " + game.score;
        console.log(food);
        // console.log(oppo_snake)
        // console.log(snake)
        // draw snake
        for (let i = 0; i < snake.segments.length; i++) {
            snake.segments[i].draw(ctx);
        }
        // draw opposition snake
        // has to be in second loop because snakes will be different lengths
        // oppo_snake.segments.forEach((segment) => {
        //     segment.draw(ctx);
        // }); //TODO why doesnt foreach work?
        for (let i = 0; i < oppo_snake.segments.length; i++) {
            oppo_snake.segments[i].draw(ctx);
        }
        // draw Food
        console.log(food);
        food.draw(ctx);
        // If hit food, add to snake and refresh food location
        if (snake.segments[0].x == food.x && snake.segments[0].y == food.y) {
            food.refresh();
            snake.addSegment({
                x: snake.segments[snake.segments.length - 1].x,
                y: snake.segments[snake.segments.length - 1].y,
            });
            game.increase_score(1);
            game.increase_speed(rampSpeed);
            if (game.score >= EMOJI_THRESHOLDS[4]) {
                scoreEmoji.innerHTML = "&#129327";
            }
            else if (game.score >= EMOJI_THRESHOLDS[3]) {
                scoreEmoji.innerHTML = "&#129397";
            }
            else if (game.score >= EMOJI_THRESHOLDS[2]) {
                scoreEmoji.innerHTML = "&#128560";
            }
            else if (game.score >= EMOJI_THRESHOLDS[1]) {
                scoreEmoji.innerHTML = "&#128556";
            }
            //window.navigator.vibrate(200);
        }
    }
}
