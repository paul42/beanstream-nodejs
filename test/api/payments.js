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
		it('Should successfully make payment', function(done) {
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
					expect(response).to.have.property('approved', '1');
					done();
				})
				.catch(function(error){
					expect(error).to.be.null;
					done();
				});
		});
		it('Should get payment declined', function(done) {
			var cardPayment = {
				order_number: testUtil.getOrderNum("payment"),
			   	amount:10.00,
			   	payment_method:"card",
			   	card:{
			      	name:"John Doe",
			      	number:"1234",
			      	expiry_month:"02",
			      	expiry_year:"19",
			      	cvd:"123"
			   	}
			};
			beanstream.payments.makePayment(cardPayment)
				.then(function(response){
					expect(false); // should not get here
					done();
				})
				.catch(function(error){
					expect(error).to.not.be.null;
					expect(error).to.have.property('status', 400);
					expect(error).to.have.property('code', 314);
					expect(error).to.have.property('category', 3);
					expect(error.details).to.deep.equal(
						[ { field: 'card:number', message: 'Invalid Card Number' } ]
					);
					done();
				});
		});
	});
});