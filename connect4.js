/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const gameContainer = document.getElementById('game');
const buttons = document.getElementById('buttons');
const board = []; // array of rows, each row is array of cells  (board[y][x])
const boardHeight = document.getElementById('height');
const boardWidth = document.getElementById('width');
boardHeight.value = HEIGHT;
boardWidth.value = WIDTH;

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	// console.log(WIDTH, HEIGHT);
	const boardHeight = document.getElementById('height');
	const boardWidth = document.getElementById('width');
	let HEIGHT = boardHeight.value;
	let WIDTH = boardWidth.value;
	for (let i = 0; i < HEIGHT; i++) {
		board[i] = [];
		for (let j = 0; j < WIDTH; j++) {
			board[i][j] = null;
		}
	}
	// console.log(board);
}

buttons.addEventListener('click', function (e) {
	if (e.target.className === 'restart') {
		location.reload();
	}
	if (e.target.className === 'make-board') {
		makeBoard();
		makeHtmlBoard();
	}
});

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const game = document.getElementById('game');
	const madeBoard = document.getElementById('made-board');
	const htmlBoard = document.getElementById('board');
	const boardHeight = document.getElementById('height');
	const boardWidth = document.getElementById('width');
	let HEIGHT = boardHeight.value;
	let WIDTH = boardWidth.value;
	console.log(WIDTH, HEIGHT);

	if (madeBoard) {
		game.replaceChild(htmlBoard, madeBoard);
	}

	// TODO: add comment for this code
	const top = document.createElement('tr'); // where currPlayer places their piece
	top.setAttribute('id', 'column-top'); // set id = 'column-top for this section
	top.addEventListener('click', handleClick); // add click event listener, call handleClick

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	// TODO: add comment for this code
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`); // set each cell's id = y-x
			row.append(cell);
		}
		htmlBoard.append(row);
	}
	htmlBoard.id = 'made-board';
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0
	let values = [];
	for (let y = 0; y < HEIGHT; y++) {
		values.push(board[y][x]);
	}
	// console.log(values);
	let allNulls = values.every(function (val) {
		return val === null;
	});
	// console.log('allNulls: ' + allNulls);
	let noNulls = values.every(function (val) {
		return val !== null;
	});
	// console.log('noNulls: ' + noNulls);
	if (noNulls) {
		return null;
	} else if (allNulls) {
		return HEIGHT - 1;
	} else {
		let y = values.findIndex(function (val) {
			return val !== null;
		});
		if (y === 0) {
			return null;
		} else return y - 1;
	}
}

function allFilled(board) {
	for (let y = 0; y < HEIGHT; y++) {
		let row = board[y];
		return row.every(function (val) {
			return val !== null;
		});
	}
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x, currPlayer) {
	// TODO: make a div and insert into correct table cell
	const newDiv = document.createElement('div');
	const targetCell = document.getElementById(y + '-' + x);
	// newDiv.innerText = 'test..';
	if (currPlayer === 1) {
		newDiv.classList.add('piece');
		newDiv.classList.add('p1');
	} else {
		newDiv.classList.add('piece');
		newDiv.classList.add('p2');
	}
	targetCell.append(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	setTimeout(function () {
		alert(msg);
	}, 500);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// first get the coordinate of the piece placed
	// get x from ID of clicked cell (tr)
	const x = +evt.target.id;

	// get next spot (top empty) in column (if none, ignore click)
	const y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	placeInTable(y, x, currPlayer);
	board[y][x] = currPlayer;

	// check for win
	if (checkForWin(y, x, currPlayer)) {
		return endGame(`Player ${currPlayer} won!`);
	}

	// check for tie
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (allFilled(board)) {
		return endGame('Game is tied!');
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	if (currPlayer === 1) {
		currPlayer = 2;
	} else currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin(y, x, currPlayer) {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(
			([y, x]) =>
				y >= 0 &&
				y < HEIGHT &&
				x >= 0 &&
				x < WIDTH &&
				board[y][x] === currPlayer
		);
	}

	// TODO: read and understand this code. Add comments to help you.
	// Every click the code will read a list of 4 cells, starting from [0,0][0,1][0,2][0,3], [0,0][1,1][2,2][3,3], [0,0][1,0][2,0][3,0], etc..

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			const horiz = [
				[y, x],
				[y, x + 1],
				[y, x + 2],
				[y, x + 3]
			];
			const vert = [
				[y, x],
				[y + 1, x],
				[y + 2, x],
				[y + 3, x]
			];
			const diagDR = [
				[y, x],
				[y + 1, x + 1],
				[y + 2, x + 2],
				[y + 3, x + 3]
			];
			const diagDL = [
				[y, x],
				[y + 1, x - 1],
				[y + 2, x - 2],
				[y + 3, x - 3]
			];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
