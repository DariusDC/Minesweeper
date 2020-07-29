const gameBoard = document.getElementById("game-board");
const timer = document.getElementById("timer");
const message = document.getElementById("final-message");
const timeRecord = document.getElementById("time-record");

let dy = [-1, -1, 0, 1, 1, 1, 0, -1];
let dx = [0, 1, 1, 1, 0, -1, -1, -1];

let gameRunning = true;
let board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let visited = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let bombIndexex = [];
let numberOfBombs = 15;
let emptyCells = 100 - numberOfBombs;

function addBombsToDom() {
    // Add the elements to dom
    for (let i = 0; i < 10; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let j = 0; j < 10; j++) {
            const col = document.createElement("div");
            col.classList.add("col");
            col.setAttribute("line", i);
            col.setAttribute("column", j);
            row.appendChild(col);
        }
        gameBoard.appendChild(row);
    }
}

function generateBombs() {
    // Generate 10 random bombs
    for (let i = 0; i < numberOfBombs; i++) {
        let x = Math.floor(Math.random() * 8);
        let y = Math.floor(Math.random() * 8);
        while (board[x][y] == '💣') {
            x = Math.floor(Math.random() * 8);
            y = Math.floor(Math.random() * 8);
        }
        board[x][y] = '💣';
    }
}

function ok(i, j) {
    if (i < 0 || i >= 10) return false;
    if (j < 0 ||  j >= 10) return false;
    return true;
} 

function countBombs(i, j) {
    let ans = 0;
    for (let direction = 0; direction < 8; direction++) {
        let i1 = i + dx[direction];
        let j1 = j + dy[direction];
        if (ok(i1, j1) && board[i1][j1] == '💣') {
            ans++;
        }
    }
    return ans;
} 

function fillTheBoard() {
    // Fill the board, every cell will contain the number of bombs besdide it
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (board[i][j] == '💣')
                continue;
            board[i][j] = countBombs(i, j);
        }
    }
}

function expand(i, j) {
    // When clicking a 0, let the empty board expand
    visited[i][j] = 1;
    i = parseInt(i);
    j = parseInt(j);
    if (board[i][j] == 0) {
        for (let direction = 0; direction < 8; direction++) {
            let i1 = i + dx[direction];
            let j1 = j + dy[direction];
            if (ok(i1, j1) && visited[i1][j1] === 0) {
                expand(i1, j1);
                // console.log(i1, j1);
            }
        }
    }

}

function initialize() {
    for (let i = 0; i < 10; i++)
        for (let j = 0; j < 10; j++) {
            board[i][j] = 0;
            visited[i][j] = 0;
        }
    gameBoard.innerHTML = ``;
    gameRunning = true;
    generateBombs();
    fillTheBoard();    
    addBombsToDom();
}   

function updateDomBoard() {
    const cells = document.querySelectorAll(".col");
    cells.forEach(cell => {
        let line = cell.getAttribute("line");
        let column = cell.getAttribute("column");
        if (visited[line][column] === 1) {
            if (!cell.classList.contains("active"))
                cell.classList.add("active");
            if (board[line][column] !== 0)
                cell.innerText = `${board[line][column]}`;
        }
    });
}

function GameOver() {
    gameRunning = false;
    message.innerHTML = `<h2 class="display-5 mb-3 text-white">Oh no... You lost 😢</h2> <h2 class="display-5 text-white mb-3" id="restart-game">Click here to restart</h2> `;

    const restartButton = document.getElementById("restart-game");
    restartButton.addEventListener("click", () => {
        message.innerHTML = ``;
        initialize();
    })
}

function gameWon() {
    gameRunning = false;
    message.innerHTML = `<h2 class="display-5 mb-3 text-white">Congratulations! You won 😄</h2> <h2 class="display-5 text-white mb-3" id="restart-game">Click here to restart</h2> `;

    const restartButton = document.getElementById("restart-game");
    restartButton.addEventListener("click", () => {
        message.innerHTML = ``;
        initialize();
    })
}

function checkWon() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (board[i][j] !== '💣' && !visited[i][j]) return false;
        } 
    }
    return true;
}

function clickBomb(e) {

    // If player lost
    if (!gameRunning) return;

    const currentElement = e.target;
    currentElement.classList.add("active");
    const line = currentElement.getAttribute("line");
    const col = currentElement.getAttribute("column");
    if (board[line][col] !== 0) {
        visited[line][col] = 1;
        currentElement.innerText = `${board[line][col]}`;
    } else {
        expand(line, col);
        updateDomBoard();
    }
    if (board[line][col] === '💣')
        GameOver();
    else {
        if (checkWon())
            gameWon();
    }
}

// Game

initialize();
gameBoard.addEventListener("click", clickBomb);