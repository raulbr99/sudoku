const BOARD_SIZE = 81;

type Cell = { number: number, isVisible: boolean }


export const isValid = (board: Cell[][], row: number, col: number, num: number): boolean => {

    for(let i = 0; i < 9; i++) {
        // check row
        if(board[row][i].number === num)
            return false;

        // check col
        if(board[i][col].number === num)
            return false
    }

    // check quadrant
    // Check 3x3 sub-box
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j].number === num) {
                return false;
            }
        }
    }
    return true
}

function shuffle(array: number[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambio de elementos
    }
}

export const fillSudoku = (board: Cell[][], row: number = 0, col: number = 0): boolean => {
    if (row === 9) {
        return true; // Puzzle completed
    }

    let nextRow = col === 8 ? row + 1 : row;
    let nextCol = col === 8 ? 0 : col + 1;

    if (board[row][col].number !== 0) {
        return fillSudoku(board, nextRow, nextCol);
    }

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(numbers); // Use the Fisher-Yates shuffle function

    for (let num of numbers) {
        if (isValid(board, row, col, num)) {
            board[row][col] = { number: num, isVisible: false };
            if (fillSudoku(board, nextRow, nextCol)) {
                return true;
            }
            board[row][col] = { number: 0, isVisible: false }; // Correct backtracking
        }
    }
    //console.log(board)
    return false; // Trigger backtracking
};

export const makePuzzle = (board: any[][], notVisible: number) => {
    let array = new Array<boolean>(BOARD_SIZE).fill(false)

    let indices = Array.from({ length: BOARD_SIZE }, (_, i) => i)

    for(let i = BOARD_SIZE - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]]
    }

    for(let i = 0; i < notVisible - 1; i++) {
        array[indices[i]] = true
    }


    board.map((row, i) => {
        row.map((cell, j) => {
            board[i][j].isVisible = array[i * 9 + j]
        })
    })
    return board
}

export const generateSudoku = (): Cell[][] => {
    let board: Cell[][] = Array.from({ length: 9 }, () => 
        Array(9).fill({ number: 0, isVisible: false })  // Inicializar cada celda como un objeto
    );
    fillSudoku(board);
    return board;
};