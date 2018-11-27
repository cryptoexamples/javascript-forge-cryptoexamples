/**
 * An example for hashing of Strings featuring:
 * - An out of the box working Example
 * - Sha-512 digest
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

const demonstrateHash = () => {
  try {
    // replace with your actual Strings
    var exampleString =
      "Text that should be authenticated by comparing the hash of it!";
    var exampleString2 =
      "Text that should be authenticated by comparing the hash of it! - 2";
    exampleString = exampleString.toString("utf8");
    exampleString2 = exampleString2.toString("utf8");

    var hashObject = forge.md.sha512.create();
    //update the hash object with data as often as required
    hashObject.update(exampleString);
    hashObject.update(exampleString2);

    var digest = forge.util.encode64(hashObject.digest().data);

    logger.info("Digest of the Strings: %s", digest);
  } catch (error) {
    logger.error(error.message);
  }
};

demonstrateHash();

// for unit testing purposes
module.exports = { demonstrateHash, logger };
