/**
 * An example for hashing of a String featuring:
 * - An out of the box working Example
 * - Importable Method/s for hashing
 * - sha-512 digest
 * - Utf8 Encoding of Strings
 * - Base64 String encoding of digest
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

const demonstrateHash = () => {
	try {
		// replace with your actual Strings
		let exampleString =
			"Text that should be authenticated by comparing the hash of it!";
		let exampleString2 =
			"Text that should be authenticated by comparing the hash of it! - 2";
		//create a hash object
		let hashObject = forge.md.sha512.create();
		//update the hash object with data as often as required
		hashObject.update(exampleString);
		hashObject.update(exampleString2);
		// create the hash values
		let digest = forge.util.encode64(hashObject.digest().data);

		logger.info("Digest of the Strings: %s", digest);
	} catch (error) {
		logger.error(error.message);
	}
};

// run the exampleFunction
demonstrateHash();
