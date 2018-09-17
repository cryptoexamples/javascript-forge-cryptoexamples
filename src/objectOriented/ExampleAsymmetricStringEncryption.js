/**
 * An example for asynchronous encryption and decryption of a String featuring:
 * - An out of the box working Example
 * - Importable Methods for encryption/decryption
 * - Generation of a RSA 2048 bit keypair
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
 * A Method to encrypt a String with a Public key. Note that to decrypt the String,
 * a related private key is necessary.
 * @param {String} stringToEncrypt The String to encrypt.
 * @param {String} publicKey The public key in binary form, which is used for encryption.
 * @return {String} encrypted The encrypted String
 */
const pubEncryptString = (stringToEncrypt, publicKey) => {
  let encrypted = publicKey.encrypt(stringToEncrypt, "RSA-OAEP");
  encrypted = forge.util.encode64(encrypted);
  return encrypted;
};
/**
 * A Method to decrypt a String with a Public key. Note that to decrypt the String,
 * a related private key is necessary.
 * @param {String} binaryToDecrypt The base64 representation of a byte array to decrypt.
 * @param {String} privateKey The private key in binary form, which is used for decryption.
 * @return {String} decrypted The decrypted String
 */
const privDecryptString = (stringToDecrypt, privateKey) => {
  let decrypted = privateKey.decrypt(
    forge.util.decode64(stringToDecrypt),
    "RSA-OAEP"
  );
  decrypted = decrypted.toString("utf8");
  return decrypted;
};

// EXAMPLE START
try {
  // replace with the actual string
  let exampleString = "Test Test 123";
  // generate Keypair, in asynchronous encryption both keys need to be related
  // and cannot be independently generated keys
  // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
  let keypair = forge.rsa.generateKeyPair({ bits: 3072, e: 0x10001 });
  // encrypt String
  let encrypted = pubEncryptString(exampleString, keypair.publicKey);
  // decrypt String
  let decrypted = privDecryptString(encrypted, keypair.privateKey);
  logger.info(
    "Decrypted String and original String are the same: %s",
    exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
  );
} catch (error) {
  logger.error(error.message);
}

// this exports the functions, making them usable in different files by importing them
module.exports = { privDecryptString, pubEncryptString };
