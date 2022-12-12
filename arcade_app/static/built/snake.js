var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let f = new FontFace("press start", "url(assets/Press_Start_2P/PressStart2P-Regular.ttf)");
f.load().then(function (font) {
    document.fonts.add(font);
});
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", "${vh}px");
let gameModal;
let game;
const STARTING_POSITIONS = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
];
const SNAKE_COLOUR = "white";
const rampSpeed = 1;
const TILE_SIZE = 20;
const SNAKE_SIZE = 20;
const EMOJI_THRESHOLDS = [0, 12, 16, 20, 24];
let timeoutID;
// Get DOM elements
let scoreHeader = document.getElementById("scoreHeader");
let scoreEmoji = document.getElementById("scoreEmoji");
class gameParameters {
    constructor(render_rate) {
        this.BACKGROUND_COLOUR = "black";
        this.SNAKE_COLOUR = "white";
        this.SNAKE_HEAD_COLOUR = "green";
        this.gameOverFlag = false;
        this.score = 0;
        this.render_rate = render_rate;
    }
    increase_score(score_increase) {
        this.score += score_increase;
    }
    increase_speed(ramp_rate) {
        this.render_rate += ramp_rate;
    }
    gameOver() {
        this.gameOverFlag = true;
        gameModal.update("gameOver");
    }
}
class Modal {
    constructor(element) {
        this.modal = element;
        this.show();
    }
    clear() {
        removeChildElements(this.modal);
    }
    hide() {
        this.modal.style.display = "none";
    }
    show() {
        this.modal.style.display = "flex";
    }
    update(option) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clear();
            switch (option) {
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
                    scoreForm.appendChild(nameInput);
                    scoreForm.appendChild(postScoreButton);
                    scoreForm.appendChild(playAgainButton);
                    this.modal.appendChild(gameOverHeader);
                    this.modal.appendChild(scoreForm);
                    break;
                case "startGame":
                    const startHeader = document.createElement("h2");
                    const startEmoji = document.createElement("h2");
                    const startButton = document.createElement("button");
                    const highScoreButton = document.createElement("button");
                    startHeader.className = "startModal__title gradient";
                    startHeader.innerText = "Snake";
                    startEmoji.className = "startModal__title";
                    startEmoji.innerHTML = "&#128013";
                    startButton.className = "menuButton";
                    startButton.type = "button";
                    startButton.innerText = "Start";
                    startButton.onclick = startGame;
                    highScoreButton.className = "menuButton";
                    highScoreButton.type = "button";
                    highScoreButton.innerText = "High Scores";
                    highScoreButton.onclick = function () {
                        gameModal.update("highScores");
                    };
                    this.modal.appendChild(startHeader);
                    this.modal.appendChild(startEmoji);
                    this.modal.appendChild(startButton);
                    this.modal.appendChild(highScoreButton);
                    break;
                case "highScores":
                    const backButton = document.createElement("button");
                    backButton.className = "menuButton";
                    backButton.innerText = "Back";
                    backButton.onclick = function () {
                        gameModal.update("startGame");
                    };
                    let list = document.createElement("ul");
                    list.className = "modal__scoreList";
                    let highScores = yield getHighScores();
                    for (let i of yield highScores) {
                        const nameSpan = document.createElement("span");
                        const scoreSpan = document.createElement("span");
                        const item = document.createElement("li");
                        nameSpan.innerHTML = i.user_name + ": ";
                        scoreSpan.innerHTML = i.score;
                        item.appendChild(nameSpan);
                        item.appendChild(scoreSpan);
                        list.appendChild(item);
                    }
                    this.modal.appendChild(list);
                    this.modal.appendChild(backButton);
                    break;
            }
            this.show();
        });
    }
}
class gameElement {
    constructor(x, y, sizeX, sizeY, colour) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.fillColour = colour;
    }
    draw(ctx) {
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, this.sizeX, this.sizeY);
    }
}
class Food extends gameElement {
    constructor() {
        super(randomIntRange(2, 28), randomIntRange(2, 28), 10, 10, "blue");
    }
    refresh() {
        this.x = randomIntRange(2, 28);
        this.y = randomIntRange(2, 28);
    }
}
class Snake {
    constructor(STARTING_POSITIONS) {
        this.segments = [];
        this.direction = "right";
        STARTING_POSITIONS.forEach((bodySegment) => {
            this.addSegment(bodySegment);
        });
    }
    addSegment(position) {
        let newSegment = new gameElement(position.x, position.y, SNAKE_SIZE, SNAKE_SIZE, SNAKE_COLOUR);
        this.segments.push(newSegment);
    }
    move() {
        switch (this.direction) {
            case "up":
                if (this.nextY != 1) {
                    this.nextX = 0;
                    this.nextY = -1;
                    break;
                }
                break;
            case "down":
                if (this.nextY != -1) {
                    this.nextX = 0;
                    this.nextY = 1;
                    break;
                }
                break;
            case "left":
                if (this.nextX != 1) {
                    this.nextX = -1;
                    this.nextY = 0;
                    break;
                }
                break;
            case "right":
                if (this.nextX != -1) {
                    this.nextX = 1;
                    this.nextY = 0;
                    break;
                }
                break;
        }
        // move snake
        this.segments.pop(); //remove tail - // TODO: check if this prevents a collision detection with final tail segment
        let newHeadPos = {
            x: this.segments[0].x + this.nextX,
            y: this.segments[0].y + this.nextY,
        };
        this.gameOverCheck(newHeadPos);
        this.segments.unshift(new gameElement(newHeadPos.x, newHeadPos.y, SNAKE_SIZE, SNAKE_SIZE, SNAKE_COLOUR));
    }
    gameOverCheck(newHeadPos) {
        // check if we've hit our own tail
        for (let i = 0; i < this.segments.length; i++) {
            if (newHeadPos.x == this.segments[i].x &&
                newHeadPos.y == this.segments[i].y) {
                game.gameOver();
            }
        }
        // check if we've hit the edge of the board
        if (this.segments[0].x >= 30 ||
            this.segments[0].x <= 0 ||
            this.segments[0].y >= 30 ||
            this.segments[0].y <= 0) {
            game.gameOver();
        }
    }
}
function startGame() {
    let canvas = document.querySelector(".myCanvas");
    canvas.width = 600;
    canvas.height = 600;
    let snake = new Snake(STARTING_POSITIONS);
    let food = new Food();
    game = new gameParameters(5);
    document.addEventListener("keydown", parseKeyInput);
    document.getElementById("upButton").addEventListener("click", function () {
        snake.direction = "up";
    });
    document.getElementById("downButton").addEventListener("click", function () {
        snake.direction = "down";
    });
    document.getElementById("leftButton").addEventListener("click", function () {
        snake.direction = "left";
    });
    document.getElementById("rightButton").addEventListener("click", function () {
        snake.direction = "right";
    });
    function parseKeyInput(e) {
        switch (e.key) {
            case "a":
                snake.direction = "left";
                break;
            case "w":
                snake.direction = "up";
                break;
            case "d":
                snake.direction = "right";
                break;
            case "s":
                snake.direction = "down";
                break;
        }
    }
    gameModal.hide();
    gameLoop();
    function gameLoop() {
        function loop() {
            if (game.gameOverFlag) {
                clearTimeout(timeoutID);
            }
            else {
                timeoutID = setTimeout(loop, 1000 / game.render_rate);
            }
            render(snake, food, canvas);
        }
        loop();
    }
}
const removeChildElements = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};
function postScore() {
    return __awaiter(this, void 0, void 0, function* () {
        let form = document.forms["scoreForm"];
        const formData = { username: form.username.value, score: game.score };
        let response = yield fetch("/score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        console.log(response);
        if (response.ok) {
            gameModal.update("highScores");
        }
        else {
            console.log("post response not ok");
        }
    });
}
function getHighScores() {
    return __awaiter(this, void 0, void 0, function* () {
        let response = yield fetch("/score", {
            method: "GET",
        });
        if (response.ok) {
            let output = yield response.json();
            console.log(output);
            return output;
        }
        else {
            console.log("get response not ok");
        }
    });
}
function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function render(snake, food, canvas) {
    // reset canvas on each iteration
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // write score
    scoreHeader.innerHTML = "Score: " + game.score;
    snake.move();
    // draw snake
    for (var i = 0; i < snake.segments.length; i++) {
        snake.segments[i].draw(ctx);
    }
    // draw Food
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
document.addEventListener("DOMContentLoaded", () => {
    gameModal = new Modal(document.getElementById("modal"));
});
