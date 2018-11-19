/**
 * An example for signing of a String featuring:
 * - An out of the box working Example
 * - Generation of a RSA keypair
 * - Sha-512 digest and RSA encryption of text with PSS
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

const demonstrateSignature = () => {
  try {
    // replace with your actual String
    var exampleString =
      "Text that should be signed to prevent unknown tampering with its content.";

    // generate a keypair, in asynchronous encryption both keys need to be related
    // and cannot be independently generated keys
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    // not needed if you already posses public and private key
    var keypair = forge.pki.rsa.generateKeyPair({ bits: 4096, e: 0x10001 });
    exampleString = exampleString.toString("utf8");

    // SIGN the string
    var pss = forge.pss.create({
      md: forge.md.sha512.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),
      saltLength: 20
    });
    var md = forge.md.sha512.create();
    md.update(exampleString, "utf8");
    var signature = forge.util.encode64(keypair["privateKey"].sign(md, pss));

    // VERIFY the String
    pss = forge.pss.create({
      md: forge.md.sha512.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),
      saltLength: 20
    });
    md = forge.md.sha512.create();
    md.update(exampleString, "utf8");
    var verified = keypair["publicKey"].verify(
      md.digest().getBytes(),
      forge.util.decode64(signature),
      pss
    );

    logger.info("is signature ok?: %s", verified);
  } catch (error) {
    logger.error(error.message);
  }
};

demonstrateSignature();

// for unit testing purposes
module.exports = { demonstrateSignature, logger };
