var testee = require("../../src/allinone/ExampleFileEncryption.js");

var chai = require("chai"),
  sinon = require("sinon"),
  mocha = require("mocha"),
  sinonChai = require("sinon-chai");

chai.use(sinonChai);

describe("ExampleFileEncryption allInOne crypto Test runs", function() {
  beforeEach(function() {
    sinon.spy(testee.logger, "error");
  });

  afterEach(function() {
    testee.logger.error.restore();
  });

  it("logger output should confirm that files are the same", function() {
    testee.demonstrateFileEncryption();
    chai.expect(testee.logger.error).to.not.be.called;
    // chai.assert.include(logger.info.getCall(0).args, "yes");
  });
});
