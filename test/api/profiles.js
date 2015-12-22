'use strict';

var expect = require('chai').expect;
var testUtil = require('../testUtils');
var beanstream = testUtil.getTestBeanstream();

describe("api", function() {
	describe("profiles", function() {
		it('Should successfully create a profile', function(done) {
			var profile = {
			   	card:{
			      	name:"Jon Profile",
			      	number:"5100000010001004",
			      	expiry_month:"02",
			      	expiry_year:"19",
			      	cvd:"123"
			   	},
			   	billing: {
			   		name: "Jon Profile",
			   		address_line1: "123 fake street",
			   		city: "victoria",
			   		province: "bc",
			   		postal_code: "V9A3Z4",
			   		country: "ca",
			   		email_address: "fake@example.com",
			   		phone_number:"12345678"
			   	}
			};
			beanstream.profiles.createProfile(profile)
				.then(function(response){
					expect(response).to.have.property('message', 'Operation Successful');
					expect(response).to.have.property('customer_code');
					done();
				})
				.catch(function(error){
					console.log(error);
					expect(error.message).to.be.null;
					done();
				});
		});
		it('Should successfully retrieve a profile', function(done) {
			var profile = {
			   	card:{
			      	name:"Jon Profile",
			      	number:"5100000010001004",
			      	expiry_month:"02",
			      	expiry_year:"19",
			      	cvd:"123"
			   	},
			   	billing: {
			   		name: "Jon Profile",
			   		address_line1: "123 fake street",
			   		city: "victoria",
			   		province: "bc",
			   		postal_code: "V9A3Z4",
			   		country: "ca",
			   		email_address: "fake@example.com",
			   		phone_number:"12345678"
			   	}
			};
			beanstream.profiles.createProfile(profile)
				.then(function(response){
					expect(response).to.have.property('message', 'Operation Successful');
					expect(response).to.have.property('customer_code');
					return response.customer_code;
				})
				.then(function(profileId){
					return beanstream.profiles.getProfile(profileId);
				})
				.then(function(profile2){
					expect(profile2).to.have.property('card');
					expect(profile2.card).to.have.property('name', 'Jon Profile');
					expect(profile2.card).to.have.property('expiry_year', '19');
					expect(profile2.card).to.have.property('expiry_month', '02');
					expect(profile2).to.have.property('billing');
					expect(profile2.billing).to.have.property('name', 'Jon Profile');
					expect(profile2.billing).to.have.property('city', 'victoria');
					done();
				})
				.catch(function(error){
					console.log(error);
					expect(error.message).to.be.null;
					done();
				});
		});
		it('Should successfully delete a profile', function(done) {
			var profile = {
			   	card:{
			      	name:"Jon Profile",
			      	number:"5100000010001004",
			      	expiry_month:"02",
			      	expiry_year:"19",
			      	cvd:"123"
			   	},
			   	billing: {
			   		name: "Jon Profile",
			   		address_line1: "123 fake street",
			   		city: "victoria",
			   		province: "bc",
			   		postal_code: "V9A3Z4",
			   		country: "ca",
			   		email_address: "fake@example.com",
			   		phone_number:"12345678"
			   	}
			};
			beanstream.profiles.createProfile(profile)
				.then(function(response){
					expect(response).to.have.property('message', 'Operation Successful');
					expect(response).to.have.property('customer_code');
					return response.customer_code;
				})
				.then(function(profileId){
					return beanstream.profiles.getProfile(profileId);
				})
				.then(function(profile2){
					expect(profile2).to.have.property('card');
					expect(profile2.card).to.have.property('name', 'Jon Profile');
					return beanstream.profiles.deleteProfile(profile2.customer_code);
				})
				.then(function(response){
					console.log("Delete response:", response);
					expect(response).to.have.property('message', 'Operation Successful');
					return beanstream.profiles.getProfile(response.customer_code);
				})
				.catch(function(error){
					expect(error).to.not.be.null;
					expect(error).to.have.property('status', 404);
					done();
				});
		});
		it('Should successfully update a profile', function(done) {
			var profile = {
			   	card:{
			      	name:"Jon Profile",
			      	number:"5100000010001004",
			      	expiry_month:"02",
			      	expiry_year:"19",
			      	cvd:"123"
			   	},
			   	billing: {
			   		name: "Jon Profile",
			   		address_line1: "123 fake street",
			   		city: "victoria",
			   		province: "bc",
			   		postal_code: "V9A3Z4",
			   		country: "ca",
			   		email_address: "fake@example.com",
			   		phone_number:"12345678"
			   	}
			};
			beanstream.profiles.createProfile(profile)
				.then(function(response){
					expect(response).to.have.property('message', 'Operation Successful');
					expect(response).to.have.property('customer_code');
					return response.customer_code;
				})
				.then(function(profileId){
					return beanstream.profiles.getProfile(profileId);
				})
				.then(function(profile2){
					expect(profile2).to.have.property('card');
					expect(profile2.card).to.have.property('name', 'Jon Profile');
					profile2.billing.name = "Tester Test";
					return beanstream.profiles.updateProfile(profile2);
				})
				.then(function(response){
					expect(response).to.have.property('message', 'Operation Successful');
					return beanstream.profiles.getProfile(response.customer_code);
				})
				.then(function(profile3){
					expect(profile3).to.have.property('billing');
					expect(profile3.billing).to.have.property('name', 'Tester Test');
					done();
				})
				.catch(function(error){
					console.log(error);
					expect(error.message).to.be.null;
					done();
				});
		});
	});
});