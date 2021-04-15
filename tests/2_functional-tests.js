const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let puzzle =
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

suite("Functional Tests", () => {
  suite("POST request to /api/solve", () => {
    test("Solve a puzzle with valid puzzle string", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .set("content-type", "application/json")
        .send({ puzzle })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.solution,
            "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
          );
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .set("content-type", "application/json")
        .send({ puzzle: "" })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .set("content-type", "application/json")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71c..9b.....1945....4.37.4.3..6a.",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve a puzzle with incorrect length", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .set("content-type", "application/json")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .set("content-type", "application/json")
        .send({
          puzzle:
            "999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("POST request to /api/check", () => {
    test("Check a puzzle placement with all fields", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle,
          coordinate: "A1",
          value: "7",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle,
          coordinate: "A1",
          value: "6",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, ["column"]);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflict", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle,
          coordinate: "A1",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, ["row", "column"]);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle,
          coordinate: "A1",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle: "",
          coordinate: "A1",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71c..9b.....1945....4.37.4.3..6a.",
          coordinate: "A1",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle:
            "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6",
          coordinate: "A1",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle,
          coordinate: "Z1",
          value: "5",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .set("content-type", "application/json")
        .send({
          puzzle,
          coordinate: "A1",
          value: "Z",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
