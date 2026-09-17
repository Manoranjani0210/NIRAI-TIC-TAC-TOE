const cells = document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const restartBtn =
    document.getElementById("restartBtn");

const resetScoreBtn =
    document.getElementById("resetScoreBtn");

const difficultySelect =
    document.getElementById("difficulty");

const playerScoreText =
    document.getElementById("playerScore");

const computerScoreText =
    document.getElementById("computerScore");

const drawScoreText =
    document.getElementById("drawScore");

const winModal =
    document.getElementById("winModal");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const playAgainBtn =
    document.getElementById("playAgainBtn");


/* GAME VARIABLES */

let board = [
    "", "", "",
    "", "", "",
    "", "", ""
];

let gameOver = false;

let computerThinking = false;

let playerScore = 0;

let computerScore = 0;

let drawScore = 0;


/* WINNING PATTERNS */

const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


/* CLICK CELLS */

cells.forEach((cell, index) => {

    cell.addEventListener("click", () => {

        /* Don't allow invalid move */

        if (
            board[index] !== "" ||
            gameOver ||
            computerThinking
        ) {
            return;
        }


        /* PLAYER MOVE */

        makeMove(index, "X");


        /* CHECK PLAYER WIN */

        const playerWin =
            getWinningPattern("X");

        if (playerWin) {

            finishGame(
                "player",
                playerWin
            );

            return;
        }


        /* CHECK DRAW */

        if (isDraw()) {

            finishGame("draw");

            return;
        }


        /* COMPUTER TURN */

        computerThinking = true;

        statusText.textContent =
            "🤖 Computer is thinking...";

        disableBoard();


        setTimeout(() => {

            computerMove();

        }, 550);

    });

});


/* MAKE MOVE */

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player === "X" ? "x" : "o"
    );

}


/* COMPUTER MOVE */

function computerMove() {

    if (gameOver) {
        return;
    }


    let move;


    const difficulty =
        difficultySelect.value;


    /* EASY */

    if (difficulty === "easy") {

        move = getRandomMove();

    }


    /* MEDIUM */

    else if (difficulty === "medium") {

        move = getMediumMove();

    }


    /* HARD */

    else {

        move = getBestMove();

    }


    if (move !== null) {

        makeMove(move, "O");

    }


    /* CHECK COMPUTER WIN */

    const computerWin =
        getWinningPattern("O");

    if (computerWin) {

        finishGame(
            "computer",
            computerWin
        );

        return;
    }


    /* CHECK DRAW */

    if (isDraw()) {

        finishGame("draw");

        return;
    }


    /* PLAYER TURN */

    computerThinking = false;

    enableBoard();

    statusText.textContent =
        "Your Turn — X";

}


/* RANDOM MOVE */

function getRandomMove() {

    const empty =
        getEmptyCells();

    if (empty.length === 0) {
        return null;
    }

    return empty[
        Math.floor(
            Math.random() * empty.length
        )
    ];

}


/* MEDIUM AI */

function getMediumMove() {

    /* First try to win */

    const winningMove =
        findWinningMove("O");

    if (winningMove !== null) {
        return winningMove;
    }


    /* Then block player */

    const blockingMove =
        findWinningMove("X");

    if (blockingMove !== null) {
        return blockingMove;
    }


    /* Otherwise random */

    return getRandomMove();

}


/* FIND WINNING MOVE */

function findWinningMove(player) {

    const empty =
        getEmptyCells();


    for (let index of empty) {

        board[index] = player;


        if (getWinningPattern(player)) {

            board[index] = "";

            return index;

        }


        board[index] = "";

    }


    return null;

}


/* HARD AI - MINIMAX */

function getBestMove() {

    let bestScore = -Infinity;

    let bestMove = null;


    for (let index = 0; index < board.length; index++) {

        if (board[index] === "") {

            board[index] = "O";


            let score =
                minimax(
                    board,
                    0,
                    false
                );


            board[index] = "";


            if (score > bestScore) {

                bestScore = score;

                bestMove = index;

            }

        }

    }


    return bestMove;

}


/* MINIMAX */

function minimax(
    currentBoard,
    depth,
    isMaximizing
) {

    if (getWinningPattern("O")) {

        return 10 - depth;

    }


    if (getWinningPattern("X")) {

        return depth - 10;

    }


    if (
        !currentBoard.includes("")
    ) {

        return 0;

    }


    if (isMaximizing) {

        let bestScore = -Infinity;


        for (
            let i = 0;
            i < currentBoard.length;
            i++
        ) {

            if (currentBoard[i] === "") {

                currentBoard[i] = "O";


                let score =
                    minimax(
                        currentBoard,
                        depth + 1,
                        false
                    );


                currentBoard[i] = "";


                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }


    else {

        let bestScore = Infinity;


        for (
            let i = 0;
            i < currentBoard.length;
            i++
        ) {

            if (currentBoard[i] === "") {

                currentBoard[i] = "X";


                let score =
                    minimax(
                        currentBoard,
                        depth + 1,
                        true
                    );


                currentBoard[i] = "";


                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }

}


/* GET EMPTY CELLS */

function getEmptyCells() {

    const empty = [];

    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (board[i] === "") {

            empty.push(i);

        }

    }

    return empty;

}


/* CHECK WINNING PATTERN */

function getWinningPattern(player) {

    for (
        let pattern of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        if (
            board[a] === player &&
            board[b] === player &&
            board[c] === player
        ) {

            return pattern;

        }

    }


    return null;

}


/* CHECK DRAW */

function isDraw() {

    return !board.includes("");

}


/* FINISH GAME */

function finishGame(
    result,
    winningPattern = null
) {

    gameOver = true;

    computerThinking = false;


    /* Highlight winning cells */

    if (winningPattern) {

        winningPattern.forEach(index => {

            cells[index]
                .classList
                .add("winner");

        });

    }


    if (result === "player") {

        playerScore++;

        playerScoreText.textContent =
            playerScore;

        showResult(
            "🏆",
            "You Win!",
            "Amazing! You defeated the computer."
        );

    }


    else if (result === "computer") {

        computerScore++;

        computerScoreText.textContent =
            computerScore;

        showResult(
            "🤖",
            "Computer Wins!",
            "Good game! Try again."
        );

    }


    else {

        drawScore++;

        drawScoreText.textContent =
            drawScore;

        showResult(
            "🤝",
            "It's a Draw!",
            "That was a close game!"
        );

    }

}


/* SHOW RESULT */

function showResult(
    icon,
    title,
    message
) {

    resultIcon.textContent =
        icon;

    resultTitle.textContent =
        title;

    resultMessage.textContent =
        message;

    setTimeout(() => {

        winModal.classList.add("show");

    }, 400);

}


/* RESTART GAME */

function restartGame() {

    board = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];

    gameOver = false;

    computerThinking = false;


    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove("x");

        cell.classList.remove("o");

        cell.classList.remove("winner");

    });


    statusText.textContent =
        "Your Turn — X";


    enableBoard();

}


/* RESTART BUTTON */

restartBtn.addEventListener(
    "click",
    () => {

        closeModal();

        restartGame();

    }
);


/* PLAY AGAIN */

playAgainBtn.addEventListener(
    "click",
    () => {

        closeModal();

        restartGame();

    }
);


/* RESET SCORE */

resetScoreBtn.addEventListener(
    "click",
    () => {

        playerScore = 0;

        computerScore = 0;

        drawScore = 0;


        playerScoreText.textContent =
            "0";

        computerScoreText.textContent =
            "0";

        drawScoreText.textContent =
            "0";


        restartGame();

    }
);


/* CLOSE MODAL */

function closeModal() {

    winModal.classList.remove("show");

}


/* DISABLE BOARD */

function disableBoard() {

    cells.forEach(cell => {

        cell.disabled = true;

    });

}


/* ENABLE BOARD */

function enableBoard() {

    cells.forEach((cell, index) => {

        cell.disabled =
            board[index] !== "" ||
            gameOver;

    });

}


/* INITIAL STATE */

enableBoard();
