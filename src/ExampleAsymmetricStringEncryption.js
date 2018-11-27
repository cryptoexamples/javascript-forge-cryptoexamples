/**
 * An example for asynchronous encryption and decryption of a String featuring:
 * - An out of the box working Example
 * - Generation of a RSA keypair
 * - RSA encryption and decryption of text using OAEP padding
 * - Utf8 Encoding of Strings
 * - base64 Encoding of byte arrays
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
    var exampleString =
      "Text that is going to be sent over an insecure channel and must be encrypted at all costs!";
    // generate Keypair, in asynchronous encryption both keys need to be related
    // and cannot be independently generated keys
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    var keypair = forge.rsa.generateKeyPair({ bits: 4096, e: 0x10001 });
    exampleString = exampleString.toString("utf8");

    // ENCRYPT String
    var toEncrypt = Buffer.from(exampleString);
    var encrypted = forge.util.encode64(
      keypair.publicKey.encrypt(toEncrypt, "RSA-OAEP", {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha1.create()
        }
      })
    );

    // DECRYPT String
    var decrypted = keypair.privateKey.decrypt(
      forge.util.decode64(encrypted),
      "RSA-OAEP",
      {
        md: forge.md.sha256.create(),
        mgf1: {
          md: forge.md.sha1.create()
        }
      }
    );
    decrypted = decrypted.toString("utf8");
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
