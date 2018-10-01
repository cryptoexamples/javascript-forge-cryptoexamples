var testee = require("../../src/objectOriented/ExampleHash.js");

var chai = require("chai"),
  mocha = require("mocha"),
  forge = require("node-forge");

let testArray = ["test", "test1", "test2", "test3"];

describe("Stringhash forge Test runs", function() {
  it("hashString shoud work with an array", function() {
    chai
      .expect(() => {
        testee.hashStrings(testArray);
      })
      .to.not.throw();
  });
});
