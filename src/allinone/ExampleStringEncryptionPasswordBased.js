/**
 * An example for synchronous encryption and decryption of a String with password derived key featuring:
 * - An out of the box working Example
 * - Importable Methods for encryption/decryption
 * - Generation of a random password
 * - derivation of a key
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

const demonstratePasswordBasedSymmetricEncryption = () => {
	try {
		// replace with yout actual String
		let exampleString =
			"Text that is going to be sent over an insecure channel and must be encrypted at all costs!";

		// the password used for derviation of a key, assign your password here
		// if none is assigned a random one is generated
		let password = null;
		password === null
			? (password = forge.random.getBytesSync(48).toString("utf8"))
			: (password = password);

		// create random salt
		let salt = forge.random.getBytesSync(128);

		// derive key with password and salt
		// keylength adheres to the "ECRYPT-CSA Recommendations" on "www.keylength.com"
		let key = forge.pkcs5.pbkdf2(password, salt, 10000, 32);

		// generate a random initialization Vector
		let iv = forge.random.getBytesSync(16);

		// encrypt the text
		let cipher = forge.cipher.createCipher("AES-GCM", key);
		cipher.start({ iv: iv });
		cipher.update(forge.util.createBuffer(exampleString));
		cipher.finish();
		let tag = cipher.mode.tag;
		let encrypted = cipher.output.data.toString("base64");

		// decrypt the text
		let decipher = forge.cipher.createDecipher("AES-GCM", key);
		decipher.start({
			iv: iv,
			tag: tag
		});
		decipher.update(forge.util.createBuffer(encrypted));
		decipher.finish();
		let decrypted = decipher.output.data;

		logger.info(
			"Decrypted String and original String are the same: %s",
			exampleString.localeCompare(decrypted) === 0 ? "yes" : "no"
		);
	} catch (error) {
		logger.error(error.message);
	}
};

// run the exampleFunction
demonstratePasswordBasedSymmetricEncryption();
