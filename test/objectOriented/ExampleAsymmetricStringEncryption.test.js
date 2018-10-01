var testee = require("../../src/objectOriented/ExampleAsymmetricStringEncryption.js");

var chai = require("chai"),
  mocha = require("mocha"),
  forge = require("node-forge");

let pair = forge.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });

describe("Stringencryptasync forge Test runs", function() {
  it("pubEncryptString should return a String", function() {
    chai.should();
    testee.pubEncryptString("test", pair.publicKey).should.be.a("string");
  });

  it("privDecryptString should return a String", function() {
    chai.should();
    testee
      .privDecryptString(
        testee.pubEncryptString("test", pair["publicKey"]),
        pair["privateKey"]
      )
      .should.be.a("string");
  });

  it("privDecryptString's return should be equal to original String", function() {
    chai.assert.equal(
      "test",
      testee.privDecryptString(
        testee.pubEncryptString("test", pair["publicKey"]),
        pair["privateKey"]
      )
    );
  });
});
