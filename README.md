beanstream-nodejs ([Legacy](https://dev.na.bambora.com/docs/references/payment_SDKs/#legacy-sdk))
=================

NodeJS integration to Bambora API.

The Node SDK for Bambora lets you take payments, save payment profiles, and run reports on your transactions. It's easy to get started, just follow the steps below

# TLS 1.2 support
For testing instructions with our TLS1.2-only server, please refer to our [developer portal](https://dev.na.bambora.com/docs/references/payment_SDKs/support_tls12/#nodejs-sdk)


# Get Started

### Step 1) Install the module using NPM
Import the project directly from npm:
```
npm install beanstream-node
```


### Step 2) Import the module to your project

```js
var beanstream = require('beanstream-node')('merchantId', 'Payments API key', 'Profiles API key', 'Reporting API key');
```
Supply your merchant ID, payments API Key, Profiles API key (optional), and Reporting API key (optional).

### Step 3) Make a Payment
The Bambora SDK uses promises to handle asynchronous calls to the server. You will get your results in a [Promise](http://bluebirdjs.com/docs/why-promises.html) object. Here is an example:

```js
var tokenPayment = {
  order_number: 'order-abc1234',
  amount:10.00,
  payment_method:'card',
  token:{
    name:'John Doe',
    code: 'token-string',
    complete: true
  }
};
beanstream.payments.makePayment(tokenPayment)
  .then(function(response){
    // successful payment
    console.log("Payment response: ", response);
  })
  .catch(function(error){
    // all errors end up here, even declined payments
    console.log(error);
  });
```

Here is an example with a raw card number:
```js
var cardPayment = {
  order_number: 'order-abc1234',
  amount:10.00,
  payment_method:'card',
  card:{
    name:'John Doe',
    number:'5100000010001004',
    expiry_month:'02',
    expiry_year:'19',
    cvd:'123'
  }
};
beanstream.payments.makePayment(cardPayment)
  .then(function(response){
    // successful payment
    console.log("Payment response: ", response);
  })
  .catch(function(error){
    // all errors end up here, even declined payments
    console.log(error);
  });
```
Note that you should tokenize cards in your client-side app in order to reduce your PCI scope. More details [here:](https://dev.na.bambora.com/docs/references/payment_SDKs/take_payments/#single-use-token)

### Step 4) Examples
Visit [developer portal](https://dev.na.bambora.com/docs/references/payment_SDKs/take_payments/) for more code examples. You will learn how to:
* create a card token
* make a payment with a token
* make a card payment
* make a card pre-authorization and completion
* make a payment profile
* charge a payment profile
* update payment profiles
* query your transaction history using reports

# Want to help improve the SDK?
Whether it is a bug fix or a new feature improvement feel free to fork the project and send us pull requests. We are always excited to work with the community to improve the project. We even have code bounties as a reward for great contributions. So never hesitate to send improvements our way!
