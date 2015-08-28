var Marionette = require('backbone.marionette'),
Radio = require('backbone.radio');


module.exports = Marionette.Controller.extend({
	initialize: function() {
		this.appChannel = Radio.channel('application');
		this.app = this.appChannel.request('instance');
	}

});
