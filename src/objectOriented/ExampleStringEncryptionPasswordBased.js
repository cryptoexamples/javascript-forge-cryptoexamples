/** An example for synchronous encryption and decryption of a String with password derived key featuring:
 * - An out of the box working Example
 * - Importable Methods for encryption/decryption
 * - Generation of a random password
 * - derivation of a key
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
 * A method to derive a key from a password and a salt
 * @param {String} password A binary file with content to encrypt.
 * @param {Integer} keyLength The lenght of the derived Key
 * @return {Buffer} derivedKey The encrypted content encoded in base64
 */
const deriveKey = (password, keyLength) => {
  let salt = forge.random.getBytesSync(128);
  let derivedKey = forge.pkcs5.pbkdf2(password, salt, 10000, keyLength);
  return derivedKey;
};

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
  let test = forge.util.encode64(encrypted.data);
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
try {
  // replace with the actual String
  let exampleString = "secret to the max";
  // the password used for derviation of a key, assign your password here
  // if none is assigned a random one is generated
  let password = null;
  if (password === null) {
    password = forge.random.getBytesSync(48).toString("utf8");
  }

  // derive key
  // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
  let key = deriveKey(password, 32);
  // generate a random initialization Vector
  var iv = forge.random.getBytesSync(16);
  // encrypt String
  let encrypted = encryptString(exampleString, key, iv);
  // decrypt String
  let decrypted = decryptString(encrypted, key, iv);

  logger.info(
    "Decrypted String and original String are the same: %s",
    exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
  );
} catch (error) {
  logger.error(error.message);
}

// this exports the functions, making them usable in different files by importing them
module.exports = { deriveKey, encryptString, decryptString };
