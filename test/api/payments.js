'use strict';

var expect = require('chai').expect;
var testUtil = require('../testUtils');
var beanstream = testUtil.getTestBeanstream();

describe("testUtil", function() {
	it('Should have test Beanstream object', function() {
		return expect(beanstream).to.not.be.null;
	});
});

describe("api", function() {
	describe("payments", function() {
		it('Should successfully make payment', function() {
			var cardPayment = {
				order_number: testUtil.getOrderNum("payment"),
			   	amount:10.00,
			   	payment_method:"card",
			   	card:{
			      	name:"John Doe",
			      	number:"5100000010001004",
			      	expiry_month:"02",
			      	expiry_year:"19",
			      	cvd:"123"
			   	}
			};
			beanstream.payments.makePayment(cardPayment)
				.then(function(response){
					console.log("Got response: ", response);
					return expect(true);
				})
				.catch(function(error){
					return expect(error).to.be.null;
				});
		});
	});
});