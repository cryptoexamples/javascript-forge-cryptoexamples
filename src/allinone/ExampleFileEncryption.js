/**
 * An example for synchronous encryption and decryption of a file featuring:
 * - An out of the box working Example
 * - generation of a random password
 * - derivation of a key from a password
 * - base64 Encoding of byte arrays
 * - Utf8 Encoding of Plaintext
 * - Logging of exceptions
 */

var forge = require("node-forge"),
  fs = require("fs"),
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

const demonstrateFileEncryption = () => {
  try {
    // the password used for derviation of a key, assign your password here
    // if none is assigned a random one is generated
    let password = null;
    if (password === null) {
      password = forge.random.getBytesSync(48).toString("utf8");
    }

    // derive key with password and salt
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    let salt = forge.random.getBytesSync(128);
    let key = forge.pkcs5.pbkdf2(password, salt, 10000, 32);

    //create random initialization vector
    let iv = forge.random.getBytesSync(16);

    // ENCRYPT the file
    let input = fs.readFileSync("file.txt");
    let cipher = forge.cipher.createCipher("AES-GCM", key);
    cipher.start({ iv: iv });
    // node buffer and forge buffer differ, so the node buffer must be converted to a forge Buffer
    cipher.update(forge.util.createBuffer(input.toString("binary")));
    cipher.finish();
    let tag = cipher.mode.tag;
    encrypted = forge.util.createBuffer();
    encrypted.putBuffer(cipher.output);
    // node buffer and forge buffer differ, so the forge buffer must be converted to a node Buffer
    encrypted = Buffer.from(encrypted.getBytes(), "binary");
    // write encrypted file
    fs.writeFileSync("file.enc.txt", encrypted);

    // DECRYPT the file
    let decipher = forge.cipher.createDecipher("AES-GCM", key);
    decipher.start({
      iv: iv,
      tag: tag
    });
    // node buffer and forge buffer differ, so the node buffer must be converted to a forge Buffer
    decipher.update(forge.util.createBuffer(encrypted.toString("binary")));
    decipher.finish();
    let decrypted = forge.util.createBuffer();
    decrypted.putBuffer(decipher.output);
    // node buffer and forge buffer differ, so the forge buffer must be converted to a node Buffer
    decrypted = Buffer.from(decrypted.getBytes(), "binary");
    // write decrypted file
    fs.writeFileSync("file.dec.txt", decrypted);
    logger.info(
      "Decrypted file content and original file content are the same: %s",
      Buffer.compare(input, decrypted) === 0 ? "yes" : "no"
    );
  } catch (error) {
    logger.error(error.message);
  }
};

demonstrateFileEncryption();

// for unit testing purposes
module.exports = { demonstrateFileEncryption, logger };
