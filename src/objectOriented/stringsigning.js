//TODO Signature is nicht in base64
/**
 * An example for signing of a String featuring:
 * - An out of the box working Example
 * - Importable Method/s for signing and verifying
 * - RSA key generation
 * - sha-512 digest and RSA encryption
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of Signature
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
/**
 * A method to create a signature for a String
 * @param {String} privateKey The privateKey for creating the signature
 * @param {String} string The String to create a signature for
 * @return {String} signature The signature encoded in base64
 */
const signString = (privateKey, string) => {
	let signature = ed25519.sign({
		message: string,
		encoding: "utf8",
		privateKey: privateKey
	});
	return signature;
};

/**
 * A method to verify the signature of a String
 * @param {String} publicKey The publicKey for verifying the signature
 * @param {String} signature The signature encoded in base64
 * @param {String} string The string for which the signature will be verified
 * @return {Boolean} verfied Returns if the String has been tampered with
 */
const verifyString = (publicKey, signature, string) => {
	let verified = ed25519.verify({
		message: string,
		encoding: "utf8",
		signature: signature,
		publicKey: publicKey
	});
	return verified;
};

// EXAMPLE START
try {
	// generate keypair. In asynchronous encryption both keys need to be related
	// and cannot be independently generated keys
	var ed25519 = forge.pki.ed25519;
	var keypair = ed25519.generateKeyPair();
	// String to make this example work, replace it with the actual String
	let exampleString = "secret. So do not tamper with it!";
	// create sign for string
	let signature = signString(keypair["privateKey"], exampleString);
	// Verify sign for string
	let verified = verifyString(keypair["publicKey"], signature, exampleString);

	logger.info("is signature ok?: %s", verified);
} catch (error) {
	logger.error(error.message);
}
