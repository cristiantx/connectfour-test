var Marionette = require('backbone.marionette'),
  Radio = require('backbone.radio'),
  $ = require('jquery'),
  _ = require('underscore'),
  template = require('../templates/layout.ejs');

var ModalRegion = require('./ModalRegion');

module.exports = Marionette.LayoutView.extend({
	el: '#app',
	template: template,
	regions: {
		board: '#board',
		info: "#info",
		modal: ModalRegion
	},
	initialize: function() {

		this.channel = Radio.channel('application');
		this.app = Radio.request('application', 'instance' );

		this.modalChannel = Radio.channel('modal');
		this.modalChannel.comply({
			'open': this.openModal
		}, this );

	},
	openModal: function( view ) {
    	this.showChildView('modal', view );
  	},

});
