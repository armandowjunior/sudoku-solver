const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

let grid = solver.strToGrid(
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
);

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", function (done) {
    let puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.validatePuzzle(puzzle), undefined);
    done();
  });

  test("Logic handles a puzzle string with invalid characters", function (done) {
    let puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..a.47...8..1..16....926914.37.";
    assert.deepEqual(solver.validatePuzzle(puzzle), {
      error: "Invalid characters in puzzle",
    });
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function (done) {
    let puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3.";
    assert.deepEqual(solver.validatePuzzle(puzzle), {
      error: "Expected puzzle to be 81 characters long",
    });
    done();
  });

  test("Logic handles a valid row placement", function (done) {
    let row = solver.rowLetterToNumber("A");
    let num = 7;
    assert.equal(solver.checkRowPlacement(grid, row, num), true);
    done();
  });

  test("Logic handles an invalid row placement", function (done) {
    let row = solver.rowLetterToNumber("A");
    let num = 1;
    assert.equal(solver.checkRowPlacement(grid, row, num), false);
    done();
  });

  test("Logic handles a valid column placement", function (done) {
    let col = 0;
    let num = 7;
    assert.equal(solver.checkColPlacement(grid, col, num), true);
    done();
  });

  test("Logic handles a invalid column placement", function (done) {
    let col = 0;
    let num = 1;
    assert.equal(solver.checkColPlacement(grid, col, num), false);
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function (done) {
    let row = solver.rowLetterToNumber("A");
    let col = 0;
    let num = 7;
    assert.equal(solver.checkRegionPlacement(grid, row, col, num), true);
    done();
  });

  test("Logic handles a invalid region (3x3 grid) placement", function (done) {
    let row = solver.rowLetterToNumber("A");
    let col = 0;
    let num = 8;
    assert.equal(solver.checkRegionPlacement(grid, row, col, num), false);
    done();
  });

  test("Valid puzzle strings pass the solver", function (done) {
    let row = solver.rowLetterToNumber("A");
    let col = 0;
    assert.equal(solver.solve(grid, row, col), true);
    done();
  });

  test("Invalid puzzle strings pass the solver", function (done) {
    let grid = solver.strToGrid(
      "999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    );
    let row = solver.rowLetterToNumber("A");
    let col = 0;
    assert.equal(solver.solve(grid, row, col), false);
    done();
  });

  test("Solver returns the the expected solution for an incomplete puzzle", function (done) {
    let row = solver.rowLetterToNumber("A");
    let col = 0;
    assert.equal(solver.solve(grid, row, col), true);
    solver.solve(grid, row, col);
    const solution = grid.flat().join("");
    assert.equal(
      solution,
      "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
    );
    done();
  });
});
