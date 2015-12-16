'use strict';

var api = require('./api');


function Payments(beanstream) {
	if (!(this instanceof Payments)) {
		return new Payments();
	}
	
	this._api = new api(beanstream);
}

Payments.prototype = {

	makePayment: function(paymentRequest) {
		// build url
		var url = this._api._beanstream.getRequestUrl() + "payments";
		
		// post request
		return this._api._POST(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("paymentsApiKey"), paymentRequest);
	},
};

module.exports = Payments;
module.exports.Payments = Payments;
