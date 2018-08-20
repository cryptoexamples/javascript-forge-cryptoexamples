/**
 * An example for signing of a String featuring:
 * - An out of the box working Example
 * - Importable Method/s for signing and verifying
 * - RSA key generation
 * - sha-512 digest and RSA encryption
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of Signature
 * - logging
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
const demonstrateSignature = () => {
	try {
		// replace with your actual Strings
		let exampleString =
			"Text that should be signed to prevent unknown tampering with its content.";

		// generate a random ED25519 keypair
		let ed25519 = forge.pki.ed25519;
		let keypair = ed25519.generateKeyPair();

		// sign the string
		let signature = ed25519
			.sign({
				message: exampleString,
				encoding: "utf8",
				privateKey: keypair["privateKey"]
			})
			.toString("base64");
		// verify the String
		let verified = ed25519.verify({
			message: exampleString,
			encoding: "utf8",
			signature: Buffer.from(signature, "base64"),
			publicKey: keypair["publicKey"]
		});

		logger.info("is signature ok?: %s", verified);
	} catch (error) {
		logger.error(error.message);
	}
};

// run the exampleFunction
demonstrateSignature();
