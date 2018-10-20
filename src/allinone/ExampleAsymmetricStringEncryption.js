/**
 * An example for asynchronous encryption and decryption of a String featuring:
 * - An out of the box working Example
 * - Generation of a RSA 3072 bit keypair
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of byte-Arrays
 * - Logging of exceptions
 */

var forge = require("node-forge"),
  winston = require("winston");

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

const demonstrateKeyBasedAsymmetricEncryption = () => {
  try {
    // replace with yout actual String
    let exampleString =
      "Text that is going to be sent over an insecure channel and must be encrypted at all costs!";
    // generate Keypair, in asynchronous encryption both keys need to be related
    // and cannot be independently generated keys
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    let keypair = forge.rsa.generateKeyPair({ bits: 3072, e: 0x10001 });

    // ENCRYPT String
    let toEncrypt = Buffer.from(exampleString);
    let encrypted = forge.util.encode64(
      keypair.publicKey.encrypt(toEncrypt, "RSA-OAEP")
    );

    // DECRYPT String
    let decrypted = keypair.privateKey.decrypt(
      forge.util.decode64(encrypted),
      "RSA-OAEP"
    );

    logger.info(
      "Decrypted String and original String are the same: %s",
      exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
    );
  } catch (error) {
    logger.error(error.message);
  }
};

demonstrateKeyBasedAsymmetricEncryption();

// for unit testing purposes
module.exports = { demonstrateKeyBasedAsymmetricEncryption, logger };
