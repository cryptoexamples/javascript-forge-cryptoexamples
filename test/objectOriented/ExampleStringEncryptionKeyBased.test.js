var testee = require("../../src/objectOriented/ExampleStringEncryptionKeyBased.js");

var chai = require("chai"),
  mocha = require("mocha"),
  forge = require("node-forge");

let testIv = forge.random.getBytesSync(16);
let testKey = forge.random.getBytesSync(32);

describe("Stringencrypt forge Test runs", function() {
  it("calling encryptString without iv, should throw an error", function() {
    chai
      .expect(() => {
        testee.encryptString("test", testKey);
      })
      .to.throw();
  });

  it("encryptString should return a String", function() {
    chai.should();
    testee.encryptString("test", testKey, testIv).should.be.a("string");
  });

  it("calling decryptString without iv, should throw an error", function() {
    chai
      .expect(() => {
        testee.decryptString("test", testKey);
      })
      .to.throw();
  });

  it("decryptString should retrun a String", function() {
    chai.should();
    testee
      .decryptString("encryptedString", testKey, testIv)
      .should.be.a("string");
  });

  it("decryptString's return should be equal to original String", function() {
    chai.assert.equal(
      "test",
      testee.decryptString(
        testee.encryptString("test", testKey, testIv),
        testKey,
        testIv
      )
    );
  });
});
