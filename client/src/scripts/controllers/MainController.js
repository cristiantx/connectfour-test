var Radio = require('backbone.radio'),
	_ = require('underscore'),
	Promise = require('bluebird'),
	AppController = require('./AppController');

var BoardView = require('../views/BoardView'),
	InfoView = require('../views/InfoView');

var Game = require('../models/Game');

// Start Local Class
module.exports = AppController.extend({
	initialize: function() {

		AppController.prototype.initialize.apply(this, arguments); // Call Parent Method.
		this.channel = Radio.channel('main');

	},
	index: {
		before: function() {
			var game = new Game();
			return game.fetch();
		},
		run: function( game ) {

			Radio.trigger('game', 'load', new Game( game ) );

			var boardView = new BoardView();
			this.app.rootView.showChildView( 'board', boardView );
			this.app.rootView.showChildView( 'info', new InfoView() );

			//this.app.rootView.showChildView( 'main', scrollLayout );
		}
	}

});
