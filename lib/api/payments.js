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

  makeSubMerchantPayment: function(subMerchantId, subMerchantPaymentsApiKey, paymentRequest) {
    // build url
    var url = this._api._beanstream.getRequestUrl() + "payments";

    // post request
    return this._api._POST(url, subMerchantId, subMerchantPaymentsApiKey, paymentRequest);
  },

  completePayment: function(transId, paymentRequest) {
    // build url
    var url = this._api._beanstream.getRequestUrl() + "payments/${transId}/completions";

    var ids = {'transId': transId};

    // post request
    return this._api._POST(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("paymentsApiKey"), paymentRequest, ids);
  },

  getPayment: function(transId) {
    // build url
    var url = this._api._beanstream.getRequestUrl() + "payments/${transId}";

    var ids = {'transId': transId};

    // get request
    return this._api._GET(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("paymentsApiKey"), ids);
  },

  voidPayment: function(transId, paymentRequest) {
    // build url
    var url = this._api._beanstream.getRequestUrl() + "payments/${transId}/void";

    var ids = {'transId': transId};

    // get request
    return this._api._POST(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("paymentsApiKey"), paymentRequest, ids);
  },

  returnPayment: function(transId, paymentRequest) {
    // build url
    var url = this._api._beanstream.getRequestUrl() + "payments/${transId}/returns";

    var ids = {'transId': transId};

    // get request
    return this._api._POST(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("paymentsApiKey"), paymentRequest, ids);
  },
};

module.exports = Payments;
module.exports.Payments = Payments;
