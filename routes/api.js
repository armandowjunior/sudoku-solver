"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    const noPuzzleValidation = solver.validatePuzzle(puzzle);

    if (noPuzzleValidation) return res.json(noPuzzleValidation);

    if (!puzzle || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });

    const grid = solver.strToGrid(puzzle);
    const row = solver.rowLetterToNumber(coordinate[0]);
    const col = parseInt(coordinate[1]) - 1;
    const num = parseInt(value);

    if ((!row && row !== 0) || (!col && col !== 0) || col < 0 || col > 8)
      return res.json({ error: "Invalid coordinate" });

    if (/[^1-9]/g.test(value)) return res.json({ error: "Invalid value" });

    let valid = solver.isSafe(grid, row, col, num);

    if (!valid && solver.checkValueInCoord(grid, row, col, num)) valid = true;

    let conflict = [];

    if (!solver.checkRowPlacement(grid, row, num)) conflict.push("row");
    if (!solver.checkColPlacement(grid, col, num)) conflict.push("column");
    if (!solver.checkRegionPlacement(grid, row, col, num))
      conflict.push("region");

    res.json(valid ? { valid } : { valid, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    const noPuzzleValidation = solver.validatePuzzle(req.body.puzzle);

    if (noPuzzleValidation) return res.json(noPuzzleValidation);

    const grid = solver.strToGrid(req.body.puzzle);
    const result = solver.solve(grid, 0, 0);

    if (!result) return res.json({ error: "Puzzle cannot be solved" });

    const solution = grid.flat().join("");

    return res.json({ solution });
  });
};
