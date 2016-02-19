# sdmp-create-signature

This module will create a [`signature`](http://sdmp.io/spec/0.13/core/signature)
container object according to the specifications in the
[SDMP](http://sdmp.io) protocol.

Three important things to note:

1. This module requires you to pass in a
	[node-rsa](https://github.com/rzcoder/node-rsa) object. This
	means that you will need to specify the signing schema in the
	options when you create it. (See below for more details.)
2. Although [the specs](http://sdmp.io/spec/0.12/core/signature/#payload)
	require the signature payload to be a valid SDMP container. This module
	does *not* validate the data in any way prior to signing.
3. You must pass in a key fingerprint and private key to generate
	the signature. However, this module does *not* validate the key
	fingerprint to the private key.

## install

This module is made to use [npm](https://www.npmjs.com/). Install
the normal `npm` way:

	npm install sdmp-create-signature

## use it

Pass in the payload to be signed as a [buffer](https://nodejs.org/api/buffer.html),
and an array of objects containing [node-rsa](https://github.com/rzcoder/node-rsa)
private key objects of `2048` bits, and the key fingerprint (an SDMP specified
string, which is the hash of the identity public key):

	var create = require('sdmp-create-encrypted')
	var listOfNodeRsaPrivateKeys = [{
		fingerprint: fingerprintOfThisKey,
		key: myNodeRsaPrivateKey
	}]
	var container = create(payload, listOfNodeRsaPrivateKeys)
	// container is a valid identity container object, e,g,
	console.log(container.signature.payload) // base64url encoded string

## node-rsa

The node-rsa module is an RSA crypto module implemented in pure
JavaScript. This gives maximum portability, but generating keys
in JS is not as fast as system-native libraries.

You can create a `node-rsa` private key object any of the following ways:

#### new key

	var NodeRSA = require('node-rsa')
	var nodeRsaPrivateKey = new NodeRSA({ b: 2048 })

#### from PEM encoded string

	var NodeRSA = require('node-rsa')
	var pemKey = '-----BEGIN RSA PRIVATE KEY-----\n...'
	var nodeRsaPrivateKey = new NodeRSA(pemKey)

## node-rsa signing schema

Note that the node-rsa module does not use the correct signing
schema by default. You will need to set the signing schema manually
in the following manner:

	nodeRsaPrivateKey.setOptions({
		signingScheme: {
			hash: 'sha512'
		}
	})

payload, listOfKeyObjects

listOfKeyObjects[].fingerprint
listOfKeyObjects[].key

## api `create(payload, listOfKeyObjects)`

In all cases, calling the function will either return a new
container object, or throw an exception.

###### `payload` *(`Buffer`, required)*

The parameter `payload` must be a [buffer](https://nodejs.org/api/buffer.html).

The [SDMP specs](http://sdmp.io/spec/0.12/core/encrypted/#payload)
require the payload to be a valid container object, so you will likely
do something like:

	var container = { /* a valid container object */ }
	var payload = new Buffer(JSON.stringify(container), 'utf8')

**Note:** The payload is not verified to be a valid container object.

###### `listOfKeyObjects` *(`array`, required)*

An array of objects containing a key and fingerprint.

###### `listOfKeyObjects[].key` *(`object`, required)*

A [node-rsa](https://github.com/rzcoder/node-rsa) equivalent
object, containing a public key of `2048` bytes.

###### `listOfKeyObjects[].fingerprint` *(`string`, required)*

The [key fingerprint](http://sdmp.io/spec/0.12/core/cryptography/#key-fingerprint)
of the key used to generate the signature.

**Note:** The fingerprint is not verified against the key.

## license

Published and released under the [Very Open License](http://veryopenlicense.com/).

<3
