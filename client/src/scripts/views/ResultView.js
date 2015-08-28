var Marionette = require('backbone.marionette'),
	Radio = require('backbone.radio'),
	$ = require('jquery'),
	_ = require('underscore'),
	template = require('../templates/result.ejs');

module.exports = Marionette.ItemView.extend({
	template: template,
	className: 'result-modal',
	events: {
		'click .rematch': 'onRematchClick'
	},
	initialize: function( options ) {

		this.winner = options.winner;
	},
	getParentClassName: function() {
		return this.className + '-container modal-container';
	},
	serializeData: function(  ) {
		return {
			winner: this.winner,
			player: Radio.request('application', 'session')
		}
	},
	onRematchClick: function() {

	}
});
