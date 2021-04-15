class SudokuSolver {
  validatePuzzle(puzzleString) {
    if (!puzzleString) return { error: "Required field missing" };

    if (/[^1-9\.]/g.test(puzzleString))
      return { error: "Invalid characters in puzzle" };

    if (puzzleString.length !== 81)
      return { error: "Expected puzzle to be 81 characters long" };
  }

  checkValueInCoord(grid, row, col, num) {
    if (grid[row][col] === num) return true;
    return false;
  }

  checkRowPlacement(grid, row, num) {
    for (let x = 0; x <= 8; x++) {
      if (grid[row][x] == num) return false;
    }
    return true;
  }

  checkColPlacement(grid, col, num) {
    for (let x = 0; x <= 8; x++) {
      if (grid[x][col] == num) return false;
    }
    return true;
  }

  checkRegionPlacement(grid, row, col, num) {
    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] == num) return false;
      }
    }
    return true;
  }

  rowLetterToNumber(row) {
    switch (row.toUpperCase()) {
      case "A":
        return 0;
      case "B":
        return 1;
      case "C":
        return 2;
      case "D":
        return 3;
      case "E":
        return 4;
      case "F":
        return 5;
      case "G":
        return 6;
      case "H":
        return 7;
      case "I":
        return 8;
      default:
        return NaN;
    }
  }

  strToGrid(puzzleString) {
    let grid = [];
    let row = [];

    for (let i = 0; i < puzzleString.length; i++) {
      // replaces the . with 0 and parses the string to int
      row.push(parseInt(puzzleString[i].replace(".", "0")));
      if ((i + 1) % 9 === 0) {
        grid.push(row);
        row = [];
      }
    }
    return grid;
  }

  isSafe(grid, row, col, num) {
    return (
      this.checkRowPlacement(grid, row, num) &&
      this.checkColPlacement(grid, col, num) &&
      this.checkRegionPlacement(grid, row, col, num)
    );
  }

  solve(grid, row, col) {
    const N = 9;
    /*if we have reached the 8th
    row and 9th column (0
    indexed matrix) ,
    we are returning true to avoid further
    backtracking       */
    if (row == N - 1 && col == N) return true;

    // Check if column value  becomes 9 ,
    // we move to next row
    // and column start from 0
    if (col == N) {
      row++;
      col = 0;
    }

    // Check if the current position
    // of the grid already
    // contains value >0, we iterate
    // for next column
    if (grid[row][col] != 0) return this.solve(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      // Check if it is safe to place
      // the num (1-9)  in the
      // given row ,col ->we move to next column
      if (this.isSafe(grid, row, col, num)) {
        /*  assigning the num in the current
      (row,col)  position of the grid and
      assuming our assined num in the position
      is correct */
        grid[row][col] = num;

        // Checking for next
        // possibility with next column
        if (this.solve(grid, row, col + 1)) return true;
      }
      /* removing the assigned num , since our
      assumption was wrong , and we go for next
      assumption with diff num value   */
      grid[row][col] = 0;
    }
    return false;
  }
}

module.exports = SudokuSolver;
