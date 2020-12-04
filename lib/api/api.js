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

  _genAuth: function(merchantID, passcode) {
    return "Passcode "+this._encode(merchantID, passcode);
  },

  _genArgs: function(auth, data, ids) {
    var args = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth,
      },
      requestConfig: {
        timeout: this._beanstream._config.timeout,
        keepAlive:false
      },
      responseConfig: {
        timeout: this._beanstream._config.timeout
      }
    };
    if (data) {
      args.data = data;
    }
    if (ids) { // path substitution
      args.path = ids;
    }

    if(this._beanstream._config.subMerchantId){
      args.headers['Sub-Merchant-Id'] = this._beanstream._config.subMerchantId;
    }

    return args;
  },

  _handleResponse: function(resolve, reject, data, response) {
    if(Buffer.isBuffer(data)){
        data = JSON.parse(data.toString('utf8'));
    }
    if (response.statusCode == 200) {
      resolve(data);
    } else {
      reject(this._buildError(response.statusCode, data));
    }
  },

  _GET: function(url, merchantID, passcode, ids) {
    //console.log("GET REQUEST...")
    //console.log("  url: ", url);

    // build auth header
    var auth = this._genAuth(merchantID, passcode);
    var args = this._genArgs(auth, null, ids);
    var self = this;

    return new Promise(function(resolve, reject) {
      // send request
      client.get(url, args, function(data, response) {
        self._handleResponse(resolve, reject, data, response);
      });
    });
  },

  _POST: function(url, merchantID, passcode, data, ids) {
    //console.log("POST REQUEST...")
    //console.log("  url: ", url);

    // build auth header
    var auth = this._genAuth(merchantID, passcode);
    var args = this._genArgs(auth, data, ids);
    var self = this;

    return new Promise(function(resolve, reject) {
      // send request
      client.post(url, args, function(data, response) {
        self._handleResponse(resolve, reject, data, response);
      });
    });
  },

  _PUT: function(url, merchantID, passcode, data, ids) {
    //console.log("PUT REQUEST...")
    //console.log("  url: ", url);

    // build auth header
    var auth = this._genAuth(merchantID, passcode);
    var args = this._genArgs(auth, data, ids);
    var self = this;

    return new Promise(function(resolve, reject) {
      // send request
      client.put(url, args, function(data, response) {
        self._handleResponse(resolve, reject, data, response);
      });
    });
  },

  _DELETE: function(url, merchantID, passcode, ids) {
    //console.log("DELETE REQUEST...")
    //console.log("  url: ", url);

    // build auth header
    var auth = this._genAuth(merchantID, passcode);
    var args = this._genArgs(auth, null, ids);
    var self = this;

    return new Promise(function(resolve, reject) {
      // send request
      client.delete(url, args, function(data, response) {
        self._handleResponse(resolve, reject, data, response);
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