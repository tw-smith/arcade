var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var f = new FontFace('press start', 'url(assets/Press_Start_2P/PressStart2P-Regular.ttf)');
f.load().then(function (font) {
    document.fonts.add(font);
});
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', '${vh}px');
var canvas, ctx;
var gameModal;
var STARTING_POSITIONS = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
var SNAKE_COLOUR = "white";
var rampSpeed = 1;
var TILE_SIZE = SNAKE_SIZE = 20;
var EMOJI_THRESHOLDS = [0, 12, 16, 20, 24];
var timeoutID;
var dir = "";
// Get DOM elements
var scoreHeader = document.getElementById("scoreHeader");
var scoreEmoji = document.getElementById("scoreEmoji");
var gameParameters = /** @class */ (function () {
    function gameParameters(nextX, nextY, render_rate) {
        this.BACKGROUND_COLOUR = "black";
        this.SNAKE_COLOUR = "white";
        this.SNAKE_HEAD_COLOUR = "green";
        this.gameOverFlag = false;
        this.score = 0;
        this.nextX = nextX;
        this.nextY = nextY;
        this.render_rate = render_rate;
    }
    ;
    gameParameters.prototype.increase_score = function (score_increase) {
        this.score += score_increase;
    };
    gameParameters.prototype.increase_speed = function (ramp_rate) {
        this.render_rate += ramp_rate;
    };
    return gameParameters;
}());
var Modal = /** @class */ (function () {
    function Modal(element) {
        this.modal = element;
        this.show();
    }
    Modal.prototype.clear = function () {
        removeChildElements(this.modal);
    };
    Modal.prototype.hide = function () {
        this.modal.style.display = "none";
    };
    Modal.prototype.show = function () {
        this.modal.style.display = "flex";
    };
    Modal.prototype.update = function (option) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, gameOverHeader, scoreForm, nameInput, postScoreButton, playAgainButton, startHeader, startEmoji, startButton, highScoreButton, backButton, list, highScores, _i, _b, i, nameSpan, scoreSpan, item;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.clear();
                        _a = option;
                        switch (_a) {
                            case "gameOver": return [3 /*break*/, 1];
                            case "startGame": return [3 /*break*/, 2];
                            case "highScores": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        gameOverHeader = document.createElement("h2");
                        scoreForm = document.createElement("form");
                        nameInput = document.createElement("input");
                        postScoreButton = document.createElement("button");
                        playAgainButton = document.createElement("button");
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
                        return [3 /*break*/, 9];
                    case 2:
                        startHeader = document.createElement("h2");
                        startEmoji = document.createElement("h2");
                        startButton = document.createElement("button");
                        highScoreButton = document.createElement("button");
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
                        highScoreButton.innerText = "High Scores";
                        highScoreButton.onclick = function () {
                            gameModal.update("highScores");
                        };
                        this.modal.appendChild(startHeader);
                        this.modal.appendChild(startEmoji);
                        this.modal.appendChild(startButton);
                        this.modal.appendChild(highScoreButton);
                        return [3 /*break*/, 9];
                    case 3:
                        backButton = document.createElement("button");
                        backButton.className = "menuButton";
                        backButton.innerText = "Back";
                        backButton.onclick = function () {
                            gameModal.update("startGame");
                        };
                        list = document.createElement("ul");
                        list.className = "modal__scoreList";
                        return [4 /*yield*/, getHighScores()];
                    case 4:
                        highScores = _c.sent();
                        _i = 0;
                        return [4 /*yield*/, highScores];
                    case 5:
                        _b = _c.sent();
                        _c.label = 6;
                    case 6:
                        if (!(_i < _b.length)) return [3 /*break*/, 8];
                        i = _b[_i];
                        nameSpan = document.createElement("span");
                        scoreSpan = document.createElement("span");
                        item = document.createElement("li");
                        nameSpan.innerHTML = i.user_name + ": ";
                        scoreSpan.innerHTML = i.score;
                        item.appendChild(nameSpan);
                        item.appendChild(scoreSpan);
                        list.appendChild(item);
                        _c.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 6];
                    case 8:
                        this.modal.appendChild(list);
                        this.modal.appendChild(backButton);
                        return [3 /*break*/, 9];
                    case 9:
                        this.show();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Modal;
}());
var gameElement = /** @class */ (function () {
    function gameElement(x, y, sizeX, sizeY, colour) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.fillColour = colour;
    }
    gameElement.prototype.draw = function (ctx) {
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, this.sizeX, this.sizeY);
    };
    return gameElement;
}());
var Food = /** @class */ (function (_super) {
    __extends(Food, _super);
    function Food() {
        return _super.call(this, randomIntRange(2, 28), randomIntRange(2, 28), 10, 10, "blue") || this;
    }
    Food.prototype.refresh = function () {
        this.x = randomIntRange(2, 28);
        this.y = randomIntRange(2, 28);
    };
    return Food;
}(gameElement));
var snakeBodyElement = /** @class */ (function (_super) {
    __extends(snakeBodyElement, _super);
    function snakeBodyElement(x, y, colour) {
        return _super.call(this, x, y, SNAKE_SIZE, SNAKE_SIZE, colour) || this;
    }
    return snakeBodyElement;
}(gameElement));
var Snake = /** @class */ (function () {
    function Snake(STARTING_POSITIONS) {
        var _this = this;
        this.segments = [];
        STARTING_POSITIONS.forEach(function (bodySegment) {
            _this.addSegment(bodySegment);
        });
    }
    ;
    Snake.prototype.addSegment = function (position) {
        var newSegment = new snakeBodyElement(position.x, position.y, SNAKE_COLOUR);
        this.segments.push(newSegment);
    };
    Snake.prototype.move = function (nextX, nextY) {
        // move snake
        this.segments.pop(); //remove tail - // TODO: check if this prevents a collision detection with final tail segment
        var newHeadPos = {
            x: (this.segments[0].x + nextX),
            y: (this.segments[0].y + nextY),
        };
        // check if snake has hit own tail
        for (var i = 0; i < this.segments.length; i++) {
            if (newHeadPos.x == this.segments[i].x && newHeadPos.y == this.segments[i].y) {
                gameOver(game.score);
            }
        }
        this.segments.unshift(new snakeBodyElement(newHeadPos.x, newHeadPos.y, SNAKE_COLOUR));
        // detect if snake has hit edge
        if ((this.segments[0].x >= 30) ||
            (this.segments[0].x <= 0) ||
            (this.segments[0].y >= 30) ||
            (this.segments[0].y <= 0)) {
            gameOver(game.score);
        }
    };
    return Snake;
}());
function initaliseGameParameters() {
    render_rate = 5;
    game = new gameParameters(1, 0, 5);
}
function initialiseCanvas() {
    canvas = document.querySelector('.myCanvas');
    width = canvas.width = 600;
    height = canvas.height = 600;
    ctx = canvas.getContext('2d');
}
function addControlsEventListeners() {
    document.addEventListener("keydown", parseKeyInput);
    document.getElementById("upButton").addEventListener("click", function () {
        controls("up");
    });
    document.getElementById("downButton").addEventListener("click", function () {
        controls("down");
    });
    document.getElementById("leftButton").addEventListener("click", function () {
        controls("left");
    });
    document.getElementById("rightButton").addEventListener("click", function () {
        controls("right");
    });
}
function parseKeyInput(e) {
    switch (e.keyCode) {
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
    controls(dir);
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
function gameLoop() {
    function loop() {
        if (game.gameOverFlag) {
            clearTimeout(timeoutID);
        }
        else {
            timeoutID = setTimeout(loop, 1000 / game.render_rate);
        }
        render();
    }
    loop();
}
function startGame() {
    initialiseCanvas();
    snake = new Snake(STARTING_POSITIONS);
    food = new Food;
    game = new gameParameters(1, 0, 5);
    addControlsEventListeners();
    gameModal.hide();
    gameLoop();
}
// Stop the game if a game over condition is reached
function gameOver(score) {
    game.gameOverFlag = true;
    gameModal.update("gameOver");
}
var removeChildElements = function (parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};
function postScore() {
    return __awaiter(this, void 0, void 0, function () {
        var form, formData, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    form = document.forms.scoreForm;
                    formData = { username: form.username.value,
                        score: score };
                    return [4 /*yield*/, fetch('/score', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData)
                        })];
                case 1:
                    response = _a.sent();
                    console.log(response);
                    if (response.ok) {
                        gameModal.update("highScores");
                    }
                    else {
                        console.log("post response not ok");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getHighScores() {
    return __awaiter(this, void 0, void 0, function () {
        var response, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('/score', {
                        method: 'GET'
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    output = _a.sent();
                    console.log(output);
                    return [2 /*return*/, output];
                case 3:
                    console.log("get response not ok");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function render() {
    // reset canvas on each iteration
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    // write score
    scoreHeader.innerHTML = "Score: " + game.score;
    snake.move(game.nextX, game.nextY);
    // draw snake // TODO: see if this can be incorporated into the for loop above for DRY
    for (var i = 0; i < snake.segments.length; i++) {
        snake.segments[i].draw(ctx);
    }
    // draw Food
    food.draw(ctx);
    // If hit food, add to snake and refresh food location
    if ((snake.segments[0].x == food.x) && (snake.segments[0].y == food.y)) {
        food.refresh();
        snake.addSegment(snake.segments[snake.segments.length - 1].x, snake.segments[snake.segments.length - 1].y);
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
document.addEventListener('DOMContentLoaded', function () {
    gameModal = new Modal(document.getElementById("modal"));
});
