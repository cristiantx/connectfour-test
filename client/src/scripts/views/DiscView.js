var Marionette = require('backbone.marionette'),
  Radio = require('backbone.radio'),
  $ = require('jquery'),
  _ = require('underscore'),
  template = require('../templates/disc.ejs');

module.exports = Marionette.ItemView.extend({

	className: 'disc-item',
	template: template,
	initialize: function() {

	},

	onRender: function() {

		this.$el.css({
			left: this.model.get('coordinates').column * 120,
			bottom: 6 * 120
		});

		if( this.model.get('player_id') == 1 ) {
			this.$el.addClass('player1');
		} else {
			this.$el.addClass('player2');
		}

	},
	onShow: function() {

		this.$el.animate({
			bottom: (5 - this.model.get('coordinates').row) * 120
		}, 'fast');

	}

});
