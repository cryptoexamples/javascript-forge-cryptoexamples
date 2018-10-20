/**
 * An example for hashing of a String featuring:
 * - An out of the box working Example
 * - sha-512 digest
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of digest
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

const demonstrateHash = () => {
  try {
    // replace with your actual Strings
    let exampleString =
      "Text that should be authenticated by comparing the hash of it!";
    let exampleString2 =
      "Text that should be authenticated by comparing the hash of it! - 2";

    let hashObject = forge.md.sha512.create();
    //update the hash object with data as often as required
    hashObject.update(exampleString);
    hashObject.update(exampleString2);

    let digest = forge.util.encode64(hashObject.digest().data);

    logger.info("Digest of the Strings: %s", digest);
  } catch (error) {
    logger.error(error.message);
  }
};

demonstrateHash();

// for unit testing purposes
module.exports = { demonstrateHash, logger };
