'use strict';

require('mocha');
// Ensure we are using the 'as promised' libs before any tests are run:
require('chai').use(require('chai-as-promised'));
var Client = require("node-rest-client").Client;
var client = new Client();

module.exports = {

  getTestBeanstream: function() {
    return require('../lib/beanstream')('300202846', 'bcB6d13774E9419787967bcAc9Fb84E0', '816211C7845349A282EA18BCA696A4DB', '35BEFFCe07ee41e1bA5eE7EB960Aa3e2', 'v1');
  },

  getOrderNum: function(prefix) {
    if (!prefix) {
      prefix = "test";
    }
    return prefix+"-"+(Math.random()*10000000);
  },

  tokenizeCard: function(card) {
    return new Promise(function(resolve, reject) {
      var args = {
        data: card,
        headers: {
          "Content-Type": "application/json"
        },
        requestConfig: {
          timeout: 12000,
          keepAlive:false
        },
        responseConfig: {
          timeout: 12000
        }
      };
      
      // send request
      client.post("https://www.beanstream.com/scripts/tokenization/tokens", args, function(data, response) {
        if(Buffer.isBuffer(data)){
          console.log(data.toString('utf8'));
          data = JSON.parse(data.toString('utf8'));
        }
        if (response.statusCode == 200) {
          resolve(data);
        } else {
          reject(data);
        }
        
      });
    });
  },
};