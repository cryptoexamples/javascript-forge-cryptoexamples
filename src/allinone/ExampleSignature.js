/**
 * An example for signing of a String featuring:
 * - An out of the box working Example
 * - RSA key generation
 * - sha-512 digest and RSA encryption
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of Signature
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
    let exampleString =
      "Text that should be signed to prevent unknown tampering with its content.";

    // generate a keypair, in asynchronous encryption both keys need to be related
    // and cannot be independently generated keys
    // keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
    // not needed if you already posses public and private key
    let keypair = forge.pki.rsa.generateKeyPair({ bits: 3072, e: 0x10001 });

    // SIGN the string
    let pss = forge.pss.create({
      md: forge.md.sha512.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),
      saltLength: 20
    });
    let md = forge.md.sha512.create();
    md.update(exampleString, "utf8");
    let signature = forge.util.encode64(keypair["privateKey"].sign(md, pss));

    // VERIFY the String
    pss = forge.pss.create({
      md: forge.md.sha512.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha512.create()),
      saltLength: 20
    });
    md = forge.md.sha512.create();
    md.update(exampleString, "utf8");
    let verified = keypair["publicKey"].verify(
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
