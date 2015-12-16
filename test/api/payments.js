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
		it('Should get a declined payment', function(done) {
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
					expect(false).to.be.true; // should not get here
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
		it('Should successfully get a past payment', function(done) {
			beanstream.payments.getPayment(10122494)
				.then(function(transaction){
					expect(transaction).to.not.be.null;
					expect(transaction).to.have.property('amount', 10);
					done();
				})
				.catch(function(error){
					expect(error).to.be.null;
					done();
				});
		});
		it('Should successfully get a new payment', function(done) {
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
			var transactionId;
			beanstream.payments.makePayment(cardPayment)
				.then(function(response){
					expect(response).to.have.property('approved', '1');
					transactionId = parseInt(response.id, 10);
					return transactionId;
				})
				.then(function(transId){
					return beanstream.payments.getPayment(transId);
				})
				.then(function(transaction) {
					expect(transaction).to.have.property('id', transactionId);
					expect(transaction).to.have.property('amount', 10);
					expect(transaction.card).to.deep.equal({ 
						name: 'John Doe',
				     	expiry_month: '02',
				     	expiry_year: '19',
				     	card_type: 'MC',
				     	last_four: '1004',
				     	avs_result: 'U',
				     	cvd_result: '1' });
					done();
				})
				.catch(function(error){
					expect(error.message).to.be.null;
					done();
				});
		});
		
	});
});