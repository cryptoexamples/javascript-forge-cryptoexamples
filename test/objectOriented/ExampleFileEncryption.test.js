import {
  deriveKey,
  encryptFile,
  decryptFile
} from "../../trans/objectOriented/ExampleFileEncryption";

var chai = require("chai"),
  mocha = require("mocha"),
  forge = require("node-forge"),
  fs = require("fs"),
  chaiFiles = require("chai-files");

let testFile = fs.readFileSync("file.txt", { encoding: "binary" });
let testFileEnc = fs.readFileSync("file.enc.txt", { encoding: "binary" });
let testIv = forge.random.getBytesSync(16);
let testKey = forge.random.getBytesSync(32);
let testFileDec = fs.readFileSync("file.dec.txt", { encoding: "binary" });

describe("fileencrypt forge Test runs", function() {
  it("calling function without iv, should throw an error", function() {
    chai
      .expect(() => {
        encryptFile(testFile, testKey);
      })
      .to.throw();
  });

  it("calling function without iv, should throw an error", function() {
    chai
      .expect(() => {
        decryptFile(testFileEnc, testKey);
      })
      .to.throw();
  });
  it("running code, should create a file 'file.enc.txt'", function() {
    chai.expect(chaiFiles.file("file.enc.txt")).to.exist;
  });
  it("running code, should create a file 'file.dec.txt'", function() {
    chai.expect(chaiFiles.file("file.dec.txt")).to.exist;
  });

  it("decrypted file should be equal to original file", function() {
    chai.assert.equal(testFile, testFileDec);
  });
});
