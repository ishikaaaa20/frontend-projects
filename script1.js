const boxes = Array.from(document.querySelectorAll('.box'));
const msg = document.querySelector('#msg');
const newBtn = document.querySelector('#newbtn');
const resetBtn = document.querySelector('#reset-btn');

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

let currentPlayer = 'O';
let isGameActive = true;
let boardState = Array(9).fill('');

function updateMessage(text) {
    msg.textContent = text;
}

function setBoardEnabled(enabled) {
    boxes.forEach((box) => {
        box.disabled = !enabled;
    });
}

function resetBoard() {
    currentPlayer = 'O';
    isGameActive = true;
    boardState = Array(9).fill('');

    boxes.forEach((box) => {
        box.textContent = '';
        box.dataset.player = '';
        box.disabled = false;
        box.classList.remove('winner-box');
    });

    updateMessage("Player O's turn");
}

function showWinner(player) {
    isGameActive = false;
    setBoardEnabled(false);

    winningPatterns.forEach((pattern) => {
        const [a, b, c] = pattern;
        if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
            [a, b, c].forEach((index) => {
                boxes[index].classList.add('winner-box');
            });
        }
    });

    updateMessage(`Player ${player} wins! 🎉`);
}

function showDraw() {
    isGameActive = false;
    setBoardEnabled(false);
    updateMessage("It's a draw! Try again.");
}

function checkWinner() {
    for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;
        const firstCell = boardState[a];

        if (firstCell && firstCell === boardState[b] && firstCell === boardState[c]) {
            showWinner(firstCell);
            return true;
        }
    }

    if (boardState.every((cell) => cell !== '')) {
        showDraw();
        return true;
    }

    return false;
}

boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (!isGameActive || boardState[index] !== '') {
            return;
        }

        boardState[index] = currentPlayer;
        box.textContent = currentPlayer;
        box.dataset.player = currentPlayer;
        box.disabled = true;

        if (checkWinner()) {
            return;
        }

        currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
        updateMessage(`Player ${currentPlayer}'s turn`);
    });
});

newBtn.addEventListener('click', resetBoard);
resetBtn.addEventListener('click', resetBoard);

resetBoard();
