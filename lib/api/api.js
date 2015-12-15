'use strict';

var Promise = require("bluebird");
var Client = Promise.promisifyAll(require("node-rest-client")).Client;
var client = new Client();

function Api(beanstream) {
	if (!(this instanceof Api)) {
		return new Api();
	}

	this._beanstream = beanstream;
}

Api.prototype = {
	_encode: function(merchantID, passcode) {
		return new Buffer(merchantID + ":" + passcode).toString('base64');
	},

	_GET: function(url, merchantID, passcode) {
		return new Promise(function(resolve) {

			// build auth header
			var auth = encode(merchantID, passcode);

			// send request
			client.get(url)
				.then(function(data, response) {
					console.log("data: ", data);
					resolve(data);
				});
		});
	},

	_POST: function(url, merchantID, passcode, data) {
		return new Promise(function(resolve) {

			// build auth header
			var auth = encode(merchantID, passcode);
			console.log("REQUEST- auth:", auth);
			
			// send request
			client.post(url)
				.then(function(data, response) {
					console.log("data: ", data);
					resolve(data);
				});
		});
	},
};

module.exports = Api;
module.exports.Api = Api;