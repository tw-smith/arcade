export const renderGame = () => {
    let content = new DocumentFragment();
    let modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "modal";
    content.appendChild(modal);
    let scoreHeader = document.createElement("h2");
    scoreHeader.id = "scoreHeader";
    scoreHeader.className = "text";
    scoreHeader.innerText = "Score: 0";
    content.appendChild(scoreHeader);
    let scoreEmoji = document.createElement("h2");
    scoreEmoji.id = "scoreEmoji";
    scoreEmoji.innerText = "place";
    content.appendChild(scoreEmoji);
    let canvas = document.createElement("canvas");
    canvas.className = "myCanvas";
    content.appendChild(canvas);
    let controlButtons = document.createElement("div");
    controlButtons.className = "controlButtons";
    content.appendChild(controlButtons);
    let leftrightButtons = document.createElement("div");
    leftrightButtons.className = "leftrightButtons";
    controlButtons.appendChild(leftrightButtons);
    const directions = [['up', '&#8593;'],
        ['left', '&#8592;'],
        ['down', '&#8595;'],
        ['right', '&#8594;']];
    directions.forEach(direction => {
        let button = document.createElement("button");
        button.type = "button";
        button.id = `${direction[0]}Button`;
        button.innerHTML = direction[1];
        button.className = 'controlButtons__button';
        switch (direction[0]) {
            case 'up':
                controlButtons.prepend(button);
                break;
            case 'down':
                controlButtons.appendChild(button);
                break;
            case 'left':
            case 'right':
                leftrightButtons.appendChild(button);
                break;
        }
    });
    document.getElementById("container").replaceChildren(content);
};
