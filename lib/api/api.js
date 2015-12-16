'use strict';

var Promise = require("bluebird");
var Client = require("node-rest-client").Client;
var client = new Client();

function Api(beanstream) {
	if (!(this instanceof Api)) {
		return new Api(beanstream);
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
			var auth = this._encode(merchantID, passcode);

			// send request
			client.get(url)
				.then(function(data, response) {
					console.log("data: ", data);
					resolve(data);
				});
		});
	},

	_POST: function(url, merchantID, passcode, data) {
		console.log("POST REQUEST...")
		console.log("  url: ", url);

		var self = this;

		// build auth header
		var auth = "Passcode "+this._encode(merchantID, passcode);
		console.log("  auth:", auth);

		var request = {
			data: data,
			headers: {
				"Content-Type": "application/json",
				"Authorization": auth,
			}
		};

		return new Promise(function(resolve, reject) {
			// send request
			client.post(url, request, function(data, response) {
				if(Buffer.isBuffer(data)){
				    data = JSON.parse(data.toString('utf8'));
				}
				if (response.statusCode == 200) {
					console.log("RESPONSE data: ", data);
					resolve(data);
				} else {
					console.log("RESPONSE ERROR status: ", response.statusCode);
					reject(self._buildError(response.statusCode, data));
				}
				
			});
		});
	},

	_buildError: function(code, message) {
		message.status = code;
		return message;
	}
};

module.exports = Api;
module.exports.Api = Api;