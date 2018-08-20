/**
 * An example for asynchronous encryption and decryption of a String featuring:
 * - An out of the box working Example
 * - Importable Methods for encryption/decryption
 * - Generation of a RSA 3072 bit keypair
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of byte-Arrays
 * - Logging
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
const demonstrateKeyBasedAsymmetricEncryption = () => {
	try {
		// replace with yout actual String
		let exampleString =
			"Text that is going to be sent over an insecure channel and must be encrypted at all costs!";
		// generate Keypair, in asynchronous encryption both keys need to be related
		// and cannot be independently generated keys
		// keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
		let keypair = forge.rsa.generateKeyPair({ bits: 3072, e: 0x10001 });

		// encrypt String
		let toEncrypt = Buffer.from(exampleString);
		let encrypted = keypair.publicKey
			.encrypt(toEncrypt, "RSA-OAEP")
			.toString("base64");

		// decrypt String
		let toDecrypt = Buffer.from(encrypted, "base64");
		let decrypted = keypair.privateKey
			.decrypt(encrypted, "RSA-OAEP")
			.toString("utf8");
		logger.info(
			"Decrypted String and original String are the same: %s",
			exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
		);
	} catch (error) {
		logger.error(error.message);
	}
};

// run the exampleFunction
demonstrateKeyBasedAsymmetricEncryption();
