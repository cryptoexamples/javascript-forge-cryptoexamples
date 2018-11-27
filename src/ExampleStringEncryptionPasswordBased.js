/**
 * An example for synchronous encryption and decryption of a String with password derived key featuring:
 * - An out of the box working Example
 * - Generation of a random password
 * - Derivation of a key from a password with PBKDF2
 * - AES-256 encryption using GCM
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

const demonstratePasswordBasedSymmetricEncryption = () => {
  try {
    // replace with yout actual String
    var exampleString =
      "Text that is going to be sent over an insecure channel and must be encrypted at all costs!";

    // the password used for derviation of a key, assign your password here
    // if none is assigned a random one is generated
    var password = null;
    if (password === null) {
      password = forge.random.getBytesSync(48).toString("utf8");
    }
    exampleString = exampleString.toString("utf8");
    // derive key with password and salt
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    var salt = forge.random.getBytesSync(128);
    var key = forge.pkcs5.pbkdf2(password, salt, 10000, 32);

    // generate a random initialization Vector
    var iv = forge.random.getBytesSync(16);

    // ENCRYPT the text
    var cipher = forge.cipher.createCipher("AES-GCM", key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(exampleString));
    cipher.finish();
    var tag = cipher.mode.tag;
    var encrypted = forge.util.encode64(cipher.output.data);

    // DECRYPT the text
    var decipher = forge.cipher.createDecipher("AES-GCM", key);
    decipher.start({
      iv: iv,
      tag: tag
    });
    decipher.update(forge.util.createBuffer(forge.util.decode64(encrypted)));
    decipher.finish();
    var decrypted = decipher.output.data;
    decrypted = decrypted.toString("utf8");
    logger.info(
      "Decrypted String and original String are the same: %s",
      exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
    );
  } catch (error) {
    logger.error(error.message);
  }
};

demonstratePasswordBasedSymmetricEncryption();

module.exports = { demonstratePasswordBasedSymmetricEncryption, logger };
