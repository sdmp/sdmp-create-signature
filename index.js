var base64url = require('base64-url')
var sha512 = require('js-sha512').sha512

function generateHash(inputString) {
	// hashing the string gives a hex output
	var hash = sha512(inputString)
	// which we transform to base64 using buffers
	return base64url.escape(new Buffer(hash, 'hex').toString('base64'))
}

module.exports = function createSignatureContainer(payload, listOfKeyObjects) {
	if (!Buffer.isBuffer(payload)) {
		throw 'payload must be a buffer'
	}
	if (!Array.isArray(listOfKeyObjects)) {
		throw 'must include list of node-rsa keys to encrypt to'
	}

	var payloadString = base64url.escape(payload.toString('base64'))
	var payloadIdentifier = generateHash(payloadString)

	var signatureObjects = listOfKeyObjects.map(function(keyObject) {
		if (typeof keyObject.fingerprint !== 'string') {
			throw 'key fingerprint must be included'
		}
		if (!keyObject.key.isPrivate()) {
			throw 'each key object must be a private key'
		}
		if (keyObject.key.getKeySize() !== 2048) {
			throw 'key size must be 2048'
		}

		// note: the specs say that the *hash* of this string is what is signed
		var stringToSign = keyObject.fingerprint + payloadIdentifier
		// note: the node-rsa module hashes the string using the algorithm
		// specified in the options you pass creating the NodeRsa object (see
		// the docs for more information), which means that you *must* set
		// the node-rsa object signing schema
		var signature = base64url.escape(keyObject.key.sign(stringToSign, 'base64'))

		return {
			fingerprint: keyObject.fingerprint,
			signature: signature
		}
	})

	return {
		sdmp: {
			version: '0.13',
			schemas: [ 'signature' ]
		},
		signature: {
			identifier: payloadIdentifier,
			payload: payloadString,
			signatures: signatureObjects
		}
	}
}
