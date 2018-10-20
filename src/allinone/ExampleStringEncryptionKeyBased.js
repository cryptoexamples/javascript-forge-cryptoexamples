/**
 * An example for synchronous encryption and decryption of a String featuring:
 * - An out of the box working Example
 * - Generation of a random Key
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
const demonstrateKeyBasedSymmetricEncryption = () => {
  try {
    // replace with yout actual String
    let exampleString =
      "Text that is going to be sent over an insecure channel and must be encrypted at all costs!";
    // the key used for encryption and decryption, assign your key here
    // if none is assigned a random one is generated
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    let key = null;
    if (key === null) {
      key = forge.random.getBytesSync(32);
    }
    //create random initialization vector
    let iv = forge.random.getBytesSync(16);

    // ENCRYPT the text
    let cipher = forge.cipher.createCipher("AES-GCM", key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(exampleString));
    cipher.finish();
    let tag = cipher.mode.tag;
    let encrypted = forge.util.encode64(cipher.output.data);

    // DECRYPT the text
    let decipher = forge.cipher.createDecipher("AES-GCM", key);
    decipher.start({
      iv: iv,
      tag: tag
    });
    decipher.update(forge.util.createBuffer(forge.util.decode64(encrypted)));
    decipher.finish();
    let decrypted = decipher.output;
    logger.info(
      "Decrypted String and original String are the same: %s",
      exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
    );
  } catch (error) {
    logger.error(error.message);
  }
};

demonstrateKeyBasedSymmetricEncryption();

// for unit testing purposes
module.exports = { demonstrateKeyBasedSymmetricEncryption, logger };
