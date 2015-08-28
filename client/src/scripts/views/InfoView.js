var Marionette = require('backbone.marionette'),
  Radio = require('backbone.radio'),
  $ = require('jquery'),
  _ = require('underscore'),
  template = require('../templates/info.ejs');

module.exports = Marionette.ItemView.extend({

	className: 'info-view',
	template: template,
	initialize: function() {
		this.gameChannel = Radio.channel('game');
		this.gameChannel.on('status:updated', this.onStatusUpdated, this );
	},
	onRender: function() {

	},
	onShow: function() {

	},
	onStatusUpdated: function() {
		this.render();
	},
	serializeData: function() {

		return {
			player: Radio.request('application', 'session'),
			state: Radio.request('game', 'state')
		}

	}

});
