var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { removeChildElements, randomIntRange } from "./utilities.js";
export class GameParameters {
    constructor(render_rate, rampSpeed) {
        this.BACKGROUND_COLOUR = "black";
        this.SNAKE_COLOUR = "white";
        this.SNAKE_HEAD_COLOUR = "green";
        this.gameOverFlag = false;
        this.score = 0;
        this.oppo_score = 0;
        this.render_rate = render_rate;
        this.RAMP_SPEED = rampSpeed;
    }
    increase_score(score_increase) {
        this.score += score_increase;
    }
    increase_speed() {
        this.render_rate += this.RAMP_SPEED;
    }
    gameOver(modal) {
        this.gameOverFlag = true;
        //modal.update("gameOver");
    }
}
export class Modal {
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
                    window.location.replace('/gameover');
                    // const gameOverHeader = document.createElement("h2");
                    // const scoreForm = document.createElement("form");
                    // const nameInput = document.createElement("input");
                    // const postScoreButton = document.createElement("button");
                    // const playAgainButton = document.createElement("button");
                    // gameOverHeader.className = "text text--big";
                    // gameOverHeader.innerText = "Game Over!";
                    // scoreForm.name = "scoreForm";
                    // scoreForm.className = "form";
                    // nameInput.name = "username";
                    // nameInput.type = "text";
                    // nameInput.className = "form__item";
                    // nameInput.required;
                    // postScoreButton.className = "form__item";
                    // postScoreButton.type = "button";
                    // postScoreButton.onclick = postScore;
                    // postScoreButton.innerText = "Submit Score";
                    // playAgainButton.className = "form__item";
                    // playAgainButton.type = "button";
                    // playAgainButton.onclick = startGame;
                    // playAgainButton.innerText = "Play Again";
                    // scoreForm.appendChild(nameInput);
                    // scoreForm.appendChild(postScoreButton);
                    // scoreForm.appendChild(playAgainButton);
                    // this.modal.appendChild(gameOverHeader);
                    // this.modal.appendChild(scoreForm);
                    break;
                // case "startGame":
                //     const startHeader = document.createElement("h2");
                //     const startEmoji = document.createElement("h2");
                //     const startButton = document.createElement("button");
                //     const highScoreButton = document.createElement("button");
                //     startHeader.className = "text--big text--title gradient";
                //     startHeader.innerText = "Snake";
                //     startEmoji.className = "text--big";
                //     startEmoji.innerHTML = "&#128013";
                //     startButton.className = "form__item";
                //     startButton.type = "button";
                //     startButton.innerText = "Start";
                //     startButton.onclick = startGame;
                //     highScoreButton.className = "form__item";
                //     highScoreButton.type = "button";
                //     highScoreButton.innerText = "High Scores";
                //     highScoreButton.onclick = function () {
                //     gameModal.update("highScores");
                //     };
                //     this.modal.appendChild(startHeader);
                //     this.modal.appendChild(startEmoji);
                //     this.modal.appendChild(startButton);
                //     this.modal.appendChild(highScoreButton);
                //     break;
                // case "highScores":
                //     const backButton = document.createElement("button");
                //     backButton.className = "form__item";
                //     backButton.innerText = "Back";
                //     backButton.onclick = function () {
                //     gameModal.update("startGame");
                //     };
                //     let list = document.createElement("ul");
                //     list.className = "list text text--red";
                //     let highScores = await getHighScores();
                //     for (let i of await highScores) {
                //     const nameSpan = document.createElement("span");
                //     const scoreSpan = document.createElement("span");
                //     const item = document.createElement("li");
                //     nameSpan.innerHTML = i.user_name + ": ";
                //     scoreSpan.innerHTML = i.score;
                //     item.appendChild(nameSpan);
                //     item.appendChild(scoreSpan);
                //     list.appendChild(item);
                //     }
                //     this.modal.appendChild(list);
                //     this.modal.appendChild(backButton);
                //     break;
            }
            this.show();
        });
    }
}
export class GameElement {
    constructor(x, y, sizeX, sizeY, colour) {
        this.TILE_SIZE = 20; //TODO should this be here or somewhere else?
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.fillColour = colour;
    }
    draw(ctx) {
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x * this.TILE_SIZE, this.y * this.TILE_SIZE, this.sizeX, this.sizeY);
    }
}
export class Food extends GameElement {
    constructor() {
        super(randomIntRange(2, 28), randomIntRange(2, 28), 10, 10, "blue");
    }
    refresh() {
        this.x = randomIntRange(2, 28);
        this.y = randomIntRange(2, 28);
    }
}
export class Snake {
    constructor(role, game) {
        this.SNAKE_SIZE = 20;
        const HOST_STARTING_POSITIONS = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 },
        ];
        const CLIENT_STARTING_POSITIONS = [
            { x: 10, y: 20 },
            { x: 9, y: 20 },
            { x: 8, y: 20 },
        ];
        this.segments = [];
        this.game = game;
        this.nextX = 1;
        this.nextY = 0;
        if (role == 'host') {
            this.SNAKE_COLOUR = 'white';
            HOST_STARTING_POSITIONS.forEach((bodySegment) => {
                this.addSegment(bodySegment);
            });
        }
        if (role == 'client') {
            this.SNAKE_COLOUR = 'blue';
            CLIENT_STARTING_POSITIONS.forEach((bodySegment) => {
                this.addSegment(bodySegment);
            });
        }
    }
    addSegment(position) {
        let newSegment = new GameElement(position.x, position.y, this.SNAKE_SIZE, this.SNAKE_SIZE, this.SNAKE_COLOUR);
        this.segments.push(newSegment);
    }
    changeDirection(direction) {
        switch (direction) {
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
    }
    move() {
        this.segments.pop();
        let newHeadPos = {
            x: this.segments[0].x + this.nextX,
            y: this.segments[0].y + this.nextY,
        };
        this.gameOverCheck(newHeadPos, this.game);
        this.segments.unshift(new GameElement(newHeadPos.x, newHeadPos.y, this.SNAKE_SIZE, this.SNAKE_SIZE, this.SNAKE_COLOUR));
    }
    gameOverCheck(newHeadPos, game) {
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
