const app = Vue.createApp({
    data() {
        return {
            board: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ],
            player: "X",
            computer: "O",
        };
    },
    methods: {
        play(i, j) {
            if (this.board[i][j] !== "") return;

            this.board[i][j] = this.player;

            if (!this.isGameOver()) {
                this.computerPlay();
            }
        },
        computerPlay() {
            // Minimax logic for unbeatable AI
            const bestMove = this.findBestMove();
            if (bestMove) {
                const { i, j } = bestMove;
                this.board[i][j] = this.computer;
            }
        },
        isGameOver() {
            return this.checkWinner(this.player) || this.checkWinner(this.computer) || this.isDraw();
        },
        isDraw() {
            return this.board.flat().every(cell => cell !== "");
        },
        checkWinner(sym) {
            const b = this.board;
            return (
                [0, 1, 2].some(i => b[i][0] === sym && b[i][1] === sym && b[i][2] === sym) ||
                [0, 1, 2].some(j => b[0][j] === sym && b[1][j] === sym && b[2][j] === sym) ||
                (b[0][0] === sym && b[1][1] === sym && b[2][2] === sym) ||
                (b[0][2] === sym && b[1][1] === sym && b[2][0] === sym)
            );
        },
        findBestMove() {
            let bestScore = -Infinity;
            let move = null;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === "") {
                        this.board[i][j] = this.computer;
                        const score = this.minimax(this.board, 0, false);
                        this.board[i][j] = "";
                        if (score > bestScore) {
                            bestScore = score;
                            move = { i, j };
                        }
                    }
                }
            }
            return move;
        },
        minimax(board, depth, isMaximizing) {
            if (this.checkWinner(this.computer)) return 1;
            if (this.checkWinner(this.player)) return -1;
            if (this.isDraw()) return 0;

            if (isMaximizing) {
                let maxEval = -Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === "") {
                            board[i][j] = this.computer;
                            const eval = this.minimax(board, depth + 1, false);
                            board[i][j] = "";
                            maxEval = Math.max(maxEval, eval);
                        }
                    }
                }
                return maxEval;
            } else {
                let minEval = Infinity;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === "") {
                            board[i][j] = this.player;
                            const eval = this.minimax(board, depth + 1, true);
                            board[i][j] = "";
                            minEval = Math.min(minEval, eval);
                        }
                    }
                }
                return minEval;
            }
        },
        reset() {
            this.board = [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ];
        }
    }
});

app.mount('#app');
