'use strict';

var api = require('./api');


function Profiles(beanstream) {
	if (!(this instanceof Profiles)) {
		return new Profiles();
	}
	
	this._api = new api(beanstream);
}

Profiles.prototype = {

	createProfile: function(profile) {
		// build url
		var url = this._api._beanstream.getRequestUrl() + "profiles";
		
		// post request
		return this._api._POST(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("profilesApiKey"), profile);
	},

	getProfile: function(profileId) {
		// build url
		var url = this._api._beanstream.getRequestUrl() + "profiles/${profileId}";
		
		var ids = {'profileId': profileId};

		// get request
		return this._api._GET(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("profilesApiKey"), ids);
	},

	updateProfile: function(profile) {
		// build url
		var url = this._api._beanstream.getRequestUrl() + "profiles/${profileId}";
		
		var ids = {'profileId': profile.customer_code};
		
		if (profile.card) {
			delete profile.card.number;
		}

		// get request
		return this._api._PUT(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("profilesApiKey"), profile, ids);
	},

	deleteProfile: function(profileId) {
		// build url
		var url = this._api._beanstream.getRequestUrl() + "profiles/${profileId}";
		
		var ids = {'profileId': profileId};

		// get request
		return this._api._DELETE(url, this._api._beanstream.getConfigField("merchantId"), this._api._beanstream.getConfigField("profilesApiKey"), ids);
	},

};

module.exports = Profiles;
module.exports.Profiles = Profiles;
