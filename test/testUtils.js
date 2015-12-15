'use strict';

require('mocha');
// Ensure we are using the 'as promised' libs before any tests are run:
require('chai').use(require('chai-as-promised'));

module.exports = {

	getTestBeanstream: function() {
		return require('../lib/beanstream')('300200578', '4BaD82D9197b4cc4b70a221911eE9f70', 'D97D3BE1EE964A6193D17A571D9FBC80', '4e6Ff318bee64EA391609de89aD4CF5d', 'v1');
	},

	getOrderNum: function(prefix) {
		if (!prefix) {
			prefix = "test";
		}
		return prefix+"-"+(Math.random()*10000000);
	}
};