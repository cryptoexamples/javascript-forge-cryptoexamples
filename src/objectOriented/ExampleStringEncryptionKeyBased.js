/**
 * An example for synchronous encryption and decryption of a String featuring:
 * - An out of the box working Example
 * - Importable Methods for encryption/decryption
 * - Generation of a random Key
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of byte-Arrays
 */

var forge = require("node-forge"),
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
 *A method to encrypt a String
 * @param {String} stringToEncrypt The String to encrypt
 * @param {Buffer} key The key in binary form, which is used for encryption
 * @param {Buffer} iv The intitalization vector for the block cipher mode
 * @return {String} encrypted The encrypted String encoded in base64
 */
const encryptString = (stringToEncrypt, key, iv) => {
  let cipher = forge.cipher.createCipher("AES-CBC", key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(stringToEncrypt));
  cipher.finish();
  let encrypted = cipher.output;
  return forge.util.encode64(encrypted.data);
};

/**
 *A method to decrypt a String
 * @param {String} stringToDecrypt The String representation of a byte array to decrypt
 * @param {Buffer} key The key in binary form, which is used for decryption
 * @param {Buffer} iv The intitalization vector for the block cipher mode
 * @return {String} decrypted The decrypted String encoded in utf8
 */
const decryptString = (stringToDecrypt, key, iv) => {
  let decipher = forge.cipher.createDecipher("AES-CBC", key);
  decipher.start({ iv: iv });
  decipher.update(
    forge.util.createBuffer(forge.util.decode64(stringToDecrypt))
  );
  decipher.finish();
  let decrypted = decipher.output;
  return decrypted.data;
};

// EXAMPLE START

// replace with ur actual String
let exampleString = "Secret to the Max";
// the key used for encryption and decryption, assign your key here
// if none is assigned a random one is generated
// keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
let key = null;
if (key === null) {
  key = forge.random.getBytesSync(32);
}
//create random initialization vector
let iv = forge.random.getBytesSync(16);
// encrypt String
let encrypted = encryptString(exampleString, key, iv);
// decrypt String
let decrypted = decryptString(encrypted, key, iv);

logger.info(
  "Decrypted String and original String are the same: %s",
  exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
);

// this exports the functions, making them usable in different files by importing them
module.exports = { encryptString, decryptString };
