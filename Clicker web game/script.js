// Configurations
let Time = 10
let IntermissionTime=10
let resetClickOnGameEnded=true

// GAME STATS
let clicks = 0;
let TimeLeft = Time;
let gameRunning = true;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

function getRandomSize() {
    const size_x_min = window.innerWidth * 0.05;
    const size_x_max = window.innerWidth * 0.15;
    const size_y_min = window.innerHeight * 0.03;
    const size_y_max = window.innerHeight * 0.10;

    let x = Math.floor(Math.random() * (size_x_max - size_x_min)) + size_x_min;
    let y = Math.floor(Math.random() * (size_y_max - size_y_min)) + size_y_min;

    return { width: `${x}px`, height: `${y}px`, widthNum: x, heightNum: y };
}

function getRandomPosition(width, height) {
    const pos_x_max = window.innerWidth - width;
    const pos_y_max = window.innerHeight - height;

    let x = Math.floor(Math.random() * pos_x_max);
    let y = Math.floor(Math.random() * pos_y_max);

    return { left: `${x}px`, top: `${y}px` };
}

function onClickEvent() {
    if (!gameRunning) {
        console.warn("Can't click while game is over.");
        return;
    }
    clicks++;
    const button = document.getElementsByClassName("clicker")[0];

    if (button) {
        button.textContent = clicks;
        button.style.backgroundColor = getRandomColor();

        const randomSize = getRandomSize();
        button.style.width = randomSize.width;
        button.style.height = randomSize.height;

        const randomPosition = getRandomPosition(randomSize.widthNum, randomSize.heightNum);
        button.style.position = "absolute";
        button.style.left = randomPosition.left;
        button.style.top = randomPosition.top;
    }
}

async function startGame() {
    if (resetClickOnGameEnded==true) {
        const button = document.getElementsByClassName("clicker")[0];
        if (button) {
            button.textContent = clicks;
            button.style.position = "absolute";
            button.style.left = "0px";
            button.style.top = "0px";
            button.style.fontSize = "80px";
        }
        clicks = 0;
    }
    console.log("Game started.");
    while (TimeLeft > 0) {
        console.log("Time Left:", TimeLeft);
        TimeLeft--;
        await delay(1000);  // 1 second
    }

    gameRunning = false;
    console.log("Game Over!");
}

async function startGameEndedHandler() {
    while (true) {
        if (!gameRunning) {
            console.log("Waiting 10 seconds to restart...");
            await delay(IntermissionTime*1000);  // wait 10 seconds
            console.log("Restarting game!");

            // Reset game state
            TimeLeft = Time;

            
            gameRunning = true;

            const button = document.getElementsByClassName("clicker")[0];
            if (button) {
                button.textContent = clicks;
                button.style.backgroundColor = getRandomColor();
            }

            await startGame();  // wait for game to end before continuing
        }
        await delay(100);  // prevent tight loop
    }
}

window.onload = async function () {
    const button = document.getElementsByClassName("clicker")[0];
    if (button) {
        button.textContent = clicks;
        button.style.position = "absolute";
        button.style.left = "0px";
        button.style.top = "0px";
        button.style.fontSize = "80px";
    }

    startGame();  // starts first game
    startGameEndedHandler();  // handles auto-restart
};
