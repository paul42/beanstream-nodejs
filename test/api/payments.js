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
          expect(response).to.have.property('type', 'P');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });
    it('Should successfully make payment on behalf of a sub-merchant', function(done) {
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
      beanstream.payments.makeSubMerchantPayment('300202846', 'bcB6d13774E9419787967bcAc9Fb84E0', cardPayment)
        .then(function(response){
          expect(response).to.have.property('approved', '1');
          expect(response).to.have.property('type', 'P');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
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
          assert.fail(0, 1, 'Meaningful Error about why this code should not be reached.');
          // expect(false).to.be.true; // should not get here
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

      var cardPayment = {
        order_number: testUtil.getOrderNum("payment"),
        amount:6.00,
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
          expect(response).to.have.property('type', 'P');
          beanstream.payments.getPayment(response.id)
            .then(function(transaction){
              expect(transaction).to.not.be.null;
              expect(transaction).to.have.property('amount', 6);
              done();
            })
            .catch(function(error){
              console.log(error);
              expect(error.message).to.be.null;
              done();
            });
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
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
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });
    it('Should successfully pre-auth and complete a payment', function(done) {
      var cardPayment = {
        order_number: testUtil.getOrderNum("payment"),
        amount:80.00,
        payment_method:"card",
        card:{
          name:"John Doe",
          number:"5100000010001004",
          expiry_month:"02",
          expiry_year:"19",
          cvd:"123",
          complete: false // false for pre-auth
        }
      };
      beanstream.payments.makePayment(cardPayment)
        .then(function(response){
          expect(response).to.have.property('approved', '1');
          expect(response).to.have.property('type', 'PA');
          return response.id;
        })
        .then(function(transId){
          return beanstream.payments.completePayment(transId, {amount: 50.50});
        })
        .then(function(result) {
          expect(result).to.have.property('approved', '1');
          expect(result).to.have.property('type', 'PAC');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });

    it('Should successfully return a payment', function(done) {
      var cardPayment = {
        order_number: testUtil.getOrderNum("payment"),
        amount:60.00,
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
          expect(response).to.have.property('type', 'P');
          return response.id;
        })
        .then(function(transId){
          // return a partial amount
          return beanstream.payments.returnPayment(transId, {amount: 40});
        })
        .then(function(result) {
          expect(result).to.have.property('approved', '1');
          expect(result).to.have.property('type', 'R');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });

    it('Should successfully void a payment', function(done) {
      var cardPayment = {
        order_number: testUtil.getOrderNum("payment"),
        amount:30.00,
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
          expect(response).to.have.property('type', 'P');
          return response.id;
        })
        .then(function(transId){
          // void payment
          return beanstream.payments.voidPayment(transId, {amount: 30});
        })
        .then(function(result) {
          expect(result).to.have.property('approved', '1');
          expect(result).to.have.property('type', 'VP');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });
    it('Should successfully void a return', function(done) {
      var cardPayment = {
        order_number: testUtil.getOrderNum("payment"),
        amount:30.00,
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
          expect(response).to.have.property('type', 'P');
          return response.id;
        })
        .then(function(transId){
          // return whole amount
          return beanstream.payments.returnPayment(transId, {amount: 30});
        })
        .then(function(result) {
          expect(result).to.have.property('approved', '1');
          expect(result).to.have.property('type', 'R');
          return result.id;
        })
        .then(function(transId){
          // void the return
          return beanstream.payments.voidPayment(transId, {amount: 30});
        })
        .then(function(result) {
          expect(result).to.have.property('approved', '1');
          expect(result).to.have.property('type', 'VR');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });
    it('Should tokenize card and make payment with token', function(done) {
      var card = {
        number:"5100000010001004",
        expiry_month:"02",
        expiry_year:"19",
        cvd:"123"
      };
      testUtil.tokenizeCard(card)
        .then(function(tokenResp) {
          expect(tokenResp).to.have.property('token');

          var tokenPayment = {
            order_number: testUtil.getOrderNum("token"),
            amount:12.00,
            payment_method:"token",
            token:{
              name:"John Doe",
              code: tokenResp.token,
              complete: true
            }
          };
          return beanstream.payments.makePayment(tokenPayment);
        })
        .then(function(response){
          expect(response).to.have.property('approved', '1');
          expect(response).to.have.property('type', 'P');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });
  });

  describe("tokens", function() {
    it('Should tokenize card and make payment with token', function(done) {
      var card = {
        number:"5100000010001004",
        expiry_month:"02",
        expiry_year:"19",
        cvd:"123"
      };
      testUtil.tokenizeCard(card)
        .then(function(tokenResp) {
          expect(tokenResp).to.have.property('token');

          var tokenPayment = {
            order_number: testUtil.getOrderNum("token"),
            amount:12.00,
            payment_method:"token",
            token:{
              name:"John Doe",
              code: tokenResp.token,
              complete: true
            }
          };
          return beanstream.payments.makePayment(tokenPayment);
        })
        .then(function(response){
          expect(response).to.have.property('approved', '1');
          expect(response).to.have.property('type', 'P');
          done();
        })
        .catch(function(error){
          console.log(error);
          expect(error.message).to.be.null;
          done();
        });
    });
  });

  describe("profiles", function() {
    it('Should make payment with a profile', function(done) {
      var card = {
          name:"Jon Profile",
          number:"5100000010001004",
          expiry_month:"02",
          expiry_year:"19",
          cvd:"123"
        };

      testUtil.tokenizeCard(card)
        .then(function(response){
          expect(response).to.have.property('token');
          var profile = {
            token: {
              name: "Jon Profile",
              code: response.token
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
          return beanstream.profiles.createProfile(profile)
        })
        .then(function(response){
          expect(response).to.have.property('message', 'Operation Successful');
          expect(response).to.have.property('customer_code');

          var profilePayment = {
            order_number: testUtil.getOrderNum("payment"),
            amount:3.00,
            payment_method:"payment_profile",
            payment_profile:{
              customer_code: response.customer_code,
              card_id: 1,
              complete: true
            },
            comment: 'making a payment with a tokenized card on a payment profile.'
          };
          return beanstream.payments.makePayment(profilePayment);
        })
        .then(function(response){
          expect(response).to.have.property('approved', '1');
          expect(response).to.have.property('type', 'P');
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
