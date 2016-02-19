var create = require('../')
var exampleKeys = require('sdmp-example-keys')
var test = require('tape')
var NodeRSA = require('node-rsa')

test('creating a signature container', function(t) {
	var privateKey = new NodeRSA(exampleKeys.privateKey)
	privateKey.setOptions({
		signingScheme: {
			hash: 'sha512'
		}
	})
	var keyFingerprint = 'note that this value is *not* checked by the module'

	var message = 'this is some really really long message that is way more than the sha512 byte length that would occur for a normal signature'
	var payload = new Buffer(message, 'utf8')

	var container = create(payload, [{
		fingerprint: keyFingerprint,
		key: privateKey
	}])

	t.equals(container.signature.identifier, 'XQqKoN3Gg90yrU-MrfEAsuFxIIUgs6zT9iZiX-Gfy2UMOaf1l-08v6_hLEAukbHFW7wr0Fj-rLT6ZvFTnxB1jA', 'the identifier should be this value')
	t.equals(container.signature.payload, 'dGhpcyBpcyBzb21lIHJlYWxseSByZWFsbHkgbG9uZyBtZXNzYWdlIHRoYXQgaXMgd2F5IG1vcmUgdGhhbiB0aGUgc2hhNTEyIGJ5dGUgbGVuZ3RoIHRoYXQgd291bGQgb2NjdXIgZm9yIGEgbm9ybWFsIHNpZ25hdHVyZQ', 'the payload should be this value')
	t.equals(container.signature.signatures.length, 1, 'only one signature object')
	t.equals(container.signature.signatures[0].fingerprint, keyFingerprint, 'fingerprint is the one passed in')
	t.equals(container.signature.signatures[0].signature, 'atu_q4eGK0OskgHp-tL0c8ezjBGK3vFbttjLYIPEJKU4ttUIu1fEvMzaoksQ31Ty8HNpiefpipElPqCJakNkbKQjhDmZjfHWDPoqJ3gqCdiqPeJSw59DQZOn70coW8oXtTbYjH7j8MbO4Mh8uOYuyvfUV5nv0tGX7ZD9C5EeI-IhEQisAfH__-kchJ10eg48hbjfZUDd2p9b8Ua85wDiln2yeZynm_H5X7qDFAIWnrLU1RAXzMoIjl2Ob2istmWshAm4BTYfL8VEBqEOd6KetW1R0i8o82G1e8xf-uuW7eS42j851fCP2flgUMX_0LfJrPH4C-MxdZCCOcyG43HpEg', 'signature should be this')

	t.end()
})