import { encryptString, decryptString } from "./stringencrypt";
var chai = require("chai"),
	mocha = require("mocha"),
	forge = require("node-forge");

let testIv = forge.random.getBytesSync(16);
let testKey = forge.random.getBytesSync(32);

describe("Stringencrypt forge Test runs", function() {
	it("calling encryptString without iv, should throw an error", function() {
		chai.expect(() => {
			encryptString("test", testKey);
		}).to.throw();
	});

	it("encryptString should return a String", function() {
		chai.should();
		encryptString("test", testKey, testIv).should.be.a("string");
	});

	it("calling decryptString without iv, should throw an error", function() {
		chai.expect(() => {
			decryptString("test", testKey);
		}).to.throw();
	});

	it("decryptString should retrun a String", function() {
		chai.should();
		decryptString("encryptedString", testKey, testIv).should.be.a("string");
	});

	it("decryptString's return should be equal to original String", function() {
		chai.assert.equal(
			"test",
			decryptString(
				encryptString("test", testKey, testIv),
				testKey,
				testIv
			)
		);
	});
});
