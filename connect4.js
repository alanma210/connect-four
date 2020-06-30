/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// let WIDTH = 7;
// let HEIGHT = 6;

// let currPlayer = 1; // active player: 1 or 2
// let endGameFlag = false;
const gameContainer = document.getElementById('game');
const buttons = document.getElementById('buttons');
const board = []; // array of rows, each row is array of cells  (board[y][x])
const boardHeight = document.getElementById('height');
const boardWidth = document.getElementById('width');
boardHeight.value = 6;
boardWidth.value = 7;

class Game {
	constructor(boardWidth = 7, boardHeight = 6) {
		this.WIDTH = boardWidth;
		this.HEIGHT = boardHeight;
		this.currPlayer = 1;
		this.endGameFlag = false;
		this.makeBoard();
		this.makeHtmlBoard();
	}

	/** makeBoard: create in-JS board structure:
	 *    board = array of rows, each row is array of cells  (board[y][x])
	 */
	makeBoard() {
		this.board = [];
		for (let i = this.HEIGHT - 1; i > -1; i--) {
			this.board[i] = [];
			for (let j = this.WIDTH - 1; j > -1; j--) {
				this.board[i][j] = null;
			}
		}
		console.log(this.board);
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */
	makeHtmlBoard() {
		// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"

		const gameDiv = document.getElementById('game');
		let htmlBoard = document.getElementById('board');
		// const boardHeight = document.getElementById('height');
		// const boardWidth = document.getElementById('width');
		// HEIGHT = boardHeight.value;
		// WIDTH = boardWidth.value;

		htmlBoard.remove();
		htmlBoard = document.createElement('table');
		htmlBoard.id = 'board';
		gameDiv.appendChild(htmlBoard);

		// TODO: add comment for this code
		const top = document.createElement('tr'); // where currPlayer places their piece
		top.setAttribute('id', 'column-top'); // set id = 'column-top for this section
		this.handleGameClick = this.handleClick.bind(this);
		top.addEventListener('click', this.handleGameClick); // add click event listener, call handleClick

		// populateTopRow

		for (let x = 0; x < this.WIDTH; x++) {
			console.log(this.currPlayer);
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			// how do i bind this.currentPlyaer?
			headCell.onmouseover = function () {
				headCell.classList.add('p' + this.currPlayer);
			};
			headCell.onmouseout = function () {
				headCell.classList.remove('p' + this.currPlayer);
			};
			top.append(headCell);
		}
		htmlBoard.append(top);

		// populateTable

		// TODO: add comment for this code
		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement('tr');
			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`); // set each cell's id = y-x
				row.append(cell);
			}
			htmlBoard.append(row);
		}
	}

	findSpotForCol(x) {
		// TODO: write the real version of this, rather than always returning 0
		let colValues = [];

		for (let y = 0; y < this.board.length; y++) {
			colValues.push(this.board[y][x]);
		} // extract column values from top down

		let colEmpty = colValues.every(function (val) {
			return val === null;
		});

		let colFilled = colValues.every(function (val) {
			return val !== null;
		});

		if (colFilled) {
			return null;
		} else if (colEmpty) {
			return this.board.length - 1;
		} else {
			let y = colValues.findIndex(function (val) {
				return val !== null;
			});
			return y - 1;
		}
	}

	/** placeInTable: update DOM to place piece into HTML table of board */
	placeInTable(y, x, currPlayer) {
		// TODO: make a div and insert into correct table cell
		console.log(y, x);
		const newDiv = document.createElement('div');
		const targetCell = document.getElementById(y + '-' + x);
		const targetCol = document.getElementById(x);

		targetCol.classList.remove('p' + currPlayer);
		newDiv.classList.add('piece');
		newDiv.classList.add('p' + currPlayer);
		targetCell.append(newDiv);
	}

	// Check if the board is all filled
	allFilled(board) {
		// just need to check the top row
		return board[0].every(function (val) {
			return val !== null;
		});
	}

	/** endGame: announce game end */
	endGame(msg) {
		// TODO: pop up alert message
		setTimeout(function () {
			alert(msg);
		}, 500);
		this.endGameFlag = true;
	}

	/** handleClick: handle click of column top to play piece */
	handleClick(evt) {
		console.log(this);
		if (this.endGameFlag) {
			return;
		} else {
			// first get the coordinate of the piece placed
			// get x from ID of clicked cell (tr)
			const x = +evt.target.id;

			// get next spot (top empty) in column (if none, ignore click)
			const y = this.findSpotForCol(x);
			if (y === null) {
				return;
			}

			// place piece in board and add to HTML table
			// TODO: add line to update in-memory board
			this.placeInTable(y, x, this.currPlayer);
			this.board[y][x] = this.currPlayer;

			// check for win
			if (checkForWin(y, x, this.currPlayer)) {
				return endGame(`Player ${this.currPlayer} won!`);
			}

			// check for tie
			// TODO: check if all cells in board are filled; if so call, call endGame
			if (this.allFilled(this.board)) {
				return endGame('Game is tied!');
			}

			// switch players
			// TODO: switch currPlayer 1 <-> 2
			this.currPlayer === 1 ? (this.currPlayer = 2) : (this.currPlayer = 1);
		}
	}
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
				y < this.HEIGHT &&
				x >= 0 &&
				x < this.WIDTH &&
				this.board[y][x] === currPlayer
		);
	}

	// TODO: read and understand this code. Add comments to help you.
	// Every click the code will read a list of 4 cells, starting from [0,0][0,1][0,2][0,3], [0,0][1,1][2,2][3,3], [0,0][1,0][2,0][3,0], etc..

	for (let y = 0; y < this.HEIGHT; y++) {
		for (let x = 0; x < this.WIDTH; x++) {
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

buttons.addEventListener('click', function (e) {
	if (e.target.className === 'restart') {
		location.reload();
	}
	if (e.target.className === 'make-board') {
		makeBoard();
		makeHtmlBoard();
	}
});

// makeBoard();
// makeHtmlBoard();

new Game(6, 7);
