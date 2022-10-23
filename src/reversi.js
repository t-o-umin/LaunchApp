const main = require('./main.js');
const message = new (require('./message.js'))();


const BG_COLOR = 23;
const CH_COLOR = 63;
const P1_COLOR = 0;
const P2_COLOR = 3;


class Reversi {
    constructor() {
        this.board = [];
        this.history = [];
        this.history_index = 0;
        this.turn = 1;
        this.undo_possible = false;
        this.redo_possible = false;
    }


    init() {
        this.board = [
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,2,0,0,0],
            [0,0,0,1,-1,2,0,0],
            [0,0,2,-1,1,0,0,0],
            [0,0,0,2,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0]
        ];
        this.history = [];
        this.history.push(copy_board(this.board));
        this.history_index = 0;
        this.turn = 1;
        this.update_board();
    }
    

    update_board() {
        let index = 81;
        let colourspecs = [];
        for(let y = 0; y < 8; y++) {
            for(let x = 0; x < 8; x++) {
                const grid = this.board[y][x];
                if(grid == 1) colourspecs.push(0, index, P1_COLOR);
                else if(grid == -1) colourspecs.push(0, index, P2_COLOR);
                else if(grid == 2) colourspecs.push(0, index, CH_COLOR);
                else colourspecs.push(0, index, BG_COLOR);
                index++;
            }
            index -= 18;
        }
        this.undo_possible ? colourspecs.push(0, 93, 45) : colourspecs.push(0, 93, 0);
        this.redo_possible ? colourspecs.push(0, 94, 53) : colourspecs.push(0, 94, 0);
        colourspecs.push(0, 99, (this.turn == 1)? P1_COLOR : P2_COLOR);
        main.output(message.lighting(colourspecs));
    }


    input(index) {
        const x = index % 10 - 1;
        const y = 8 - (index / 10 | 0);
        // on board pressed
        console.log(x, y);
        if(0 <= x && x <= 7 && 0 <= y && y <= 7 && this.board[y][x] == 2) {
            this.board = copy_board(this.board);
            // search flip
            this.board[y][x] = this.turn;
            let flip_list = [];
            const dx = [1, 1, 0, -1, -1, -1, 0, 1];
            const dy = [0, 1, 1, 1, 0, -1, -1, -1];
            for(let i = 0; i < 8; i++) {
                let nx = x;
                let ny = y;
                let searching = true;
                let count = 0;
                while(searching) {
                    nx += dx[i];
                    ny += dy[i];
                    // cannot place
                    if(nx < 0 || 7 < nx || ny < 0 || 7 < ny || this.board[ny][nx] == 0) {
                        searching = false;
                        for(let j = 0; j < count; j++) {
                            flip_list.pop();
                        }
                    }
                    else if(this.board[ny][nx] == -this.turn) {
                        flip_list.push([ny, nx]);
                        count++;
                    }
                    else if(this.board[ny][nx] == this.turn) {
                        searching = false;
                    }
                }
            }
            // flip
            for(let i = 0; i < flip_list.length; i++) {
                this.board[flip_list[i][0]][flip_list[i][1]] *= -1;
            }
            this.turn *= -1;
            // remove choices
            for(let x = 0; x < 8; x++) {
                for(let y = 0; y < 8; y++) {
                    if(this.board[y][x] == 2) this.board[y][x] = 0;
                }
            }
            // search next choices
            for(let x = 0; x < 8; x++) for(let y = 0; y < 8; y++) {
                if(this.board[y][x] != this.turn) continue;
                for(let i = 0; i < 8; i++) {
                    let nx = x;
                    let ny = y;
                    let searching = true;
                    let count = 0;
                    while(searching) {
                        nx += dx[i];
                        ny += dy[i];
                        // cannot place
                        if(nx < 0 || 7 < nx || ny < 0 || 7 < ny || this.board[ny][nx] == this.turn) {
                            searching = false;
                        }
                        else if(this.board[ny][nx] == -this.turn) {
                            count++;
                        }
                        else if(this.board[ny][nx] == 0 || this.board[ny][nx] == 2) {
                            searching = false;
                            if(count > 0) this.board[ny][nx] = 2;
                        }
                    }
                }
            }
            this.history_index++;
            this.undo_possible = true;
            this.redo_possible = false;
            for(let i = 0; i < this.history.length - this.history_index; i++) {
                this.history.pop();
            }
            this.history.push(copy_board(this.board));
        }
        // <- history
        if(x == 2 && y == -1) {
            if(this.history_index > 0) this.turn *= -1;
            this.history_index = Math.max(this.history_index - 1, 0);
            this.undo_possible = this.history_index > 0;
            this.redo_possible = this.history_index < this.history.length - 1;
            this.board = this.history[this.history_index];
        }
        // history ->
        if(x == 3 && y == -1) {
            if(this.history_index < this.history.length - 1) this.turn *= -1;
            this.history_index = Math.min(this.history_index + 1, this.history.length - 1);
            this.undo_possible = this.history_index > 0;
            this.redo_possible = this.history_index < this.history.length - 1;
            this.board = this.history[this.history_index];
        }
        this.update_board();
    }
}


function copy_board(board) {
    let copy = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    for(let x = 0; x < 8; x++) for(let y = 0; y < 8; y++) {
        copy[y][x] = board[y][x];
    }
    return copy;
}


module.exports = Reversi;