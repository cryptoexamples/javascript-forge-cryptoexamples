/**
 * An example for synchronous encryption and decryption of a file featuring:
 * - An out of the box working Example
 * - Importable Methods for encryption/decryption of a file
 * - generation of a random password
 * - derivation of a key from a password
 * - base64 Encoding of byte arrays
 * - Utf8 Encoding of Plaintext
 * - Logging
 */

var forge = require("node-forge"),
  fs = require("fs"),
  winston = require("winston");

// to enable Logging, having winston logger installed is required
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
      handleExceptions: true
    })
  ]
});

/**
 * A method to derive a key from a password and a salt
 * @param {String} password A String with which the key is getting derived
 * @param {Integer} keyLength The lenght of the derived Key
 * @return {Buffer} key The encrypted content encoded in base64
 */
const deriveKey = (password, keyLength) => {
  let salt = forge.random.getBytesSync(128);
  let key = forge.pkcs5.pbkdf2(password, salt, 10000, keyLength);
  return key;
};

/**
 * A method to encrypt file content with a synchronous key, note that in
 * order to correctly decrypt the file content, the same key and iv (initialization vector)
 * have to be used
 * @param {Buffer} fileContent The file content to encrypt.
 * @param {Buffer} key The key in binary form, which is used for encryption.
 * @param {Buffer} iv The intitalization vector for the block cipher mode
 * @return {Buffer} outputEnc A Buffer with the encrypted content
 */
const encryptFileContent = (fileContent, key, iv) => {
  // encrypt the filecontent
  let cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  // node buffer and forge buffer differ, so the node buffer must be converted to a forge Buffer
  cipher.update(forge.util.createBuffer(fileContent.toString("binary")));
  cipher.finish();
  let outputEnc = forge.util.createBuffer();
  outputEnc.putBuffer(cipher.output);
  // node buffer and forge buffer differ, so the forge buffer must be converted to a node Buffer
  outputEnc = Buffer.from(outputEnc.getBytes(), "binary");
  return outputEnc;
};

/**
 * A method to decrypt a file content with a synchronous key, note that in
 * order to correctly decrypt the file content, the key and iv (initialization vector)
 * must be the same as the key and iv used with encryption
 * @param {Buffer} fileContent The file content to encrypt.
 * @param {Buffer} key The key in binary form, which is used for encryption.
 * @param {Buffer} iv The intitalization vector for the block cipher mode
 * @return {Buffer} outputDec A Buffer with the decrypted content
 */
const decryptFileContent = (fileContent, key, iv) => {
  let decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  // node buffer and forge buffer differ, so the node buffer must be converted to a forge Buffer
  decipher.update(forge.util.createBuffer(fileContent.toString("binary")));
  decipher.finish();
  let outputDec = forge.util.createBuffer();
  outputDec.putBuffer(decipher.output);
  // node buffer and forge buffer differ, so the forge buffer must be converted to a node Buffer
  outputDec = Buffer.from(outputDec.getBytes(), "binary");
  return outputDec;
};

// EXAMPLE START
try {
  // the password used for derviation of a key, assign your password here
  // if none is assigned a random one is generated
  let password = null;
  if (password === null) {
    password = forge.random.getBytesSync(48).toString("utf8");
  }
  // derive a key from the password
  // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
  let key = deriveKey(password, 32);
  // create random initialization vector
  let iv = forge.random.getBytesSync(16);
  // read file and put content into a node Buffer
  let input = fs.readFileSync("file.txt");
  // encrypt file content and write encrypted file content to file
  let encrypted = encryptFileContent(input, key, iv);
  fs.writeFileSync("file.enc.txt", encrypted);
  // decrypt file content and write dercypted file content to file
  let decrypted = decryptFileContent(encrypted, key, iv);
  fs.writeFileSync("file.dec.txt", decrypted);

  logger.info(
    "Decrypted file content and original file content are the same: %s",
    Buffer.compare(input, decrypted) === 0 ? "yes" : "no"
  );
} catch (error) {
  logger.error(error.message);
}
// this exports the functions, making them usable in different files by importing them
module.exports = { deriveKey, encryptFileContent, decryptFileContent };
