var Marionette = require('backbone.marionette'),
  Radio = require('backbone.radio'),
  $ = require('jquery'),
  _ = require('underscore'),
  template = require('../templates/board.ejs');

var DiscView = require('../views/DiscView'),
	ResultView = require('../views/ResultView');

var Move = require('../models/Move');

module.exports = Marionette.CompositeView.extend({

	className: 'board-container',
	template: template,
	childView: DiscView,
	childViewContainer: '.board-box',
	events: {
		'click .board-column': 'onColumnClick'
	},
	initialize: function() {

		this.collection = Radio.request('game', 'moves');
		this.channel = Radio.channel('game');

		this.channel.on('winner', function( winner ) {
			console.log('opening modal winner');
			Radio.command('modal', 'open', new ResultView({ winner: winner }));
		}, this );

	},

	onColumnClick: function( e ) {

		e.preventDefault();
		var $el = $(e.currentTarget);
		var columnIndex = this.$el.find( '.board-column' ).index( $el );
		var currentGame = Radio.request('game', 'info' );

		console.log( currentGame.get('player_turn_id'), Radio.request('application', 'session').get('id') );

		if( currentGame.get('player_turn_id') != Radio.request('application', 'session').get('id') ) {
			return;
		}

		Radio.trigger('game', 'move:add', new Move({
			column: columnIndex,
			player_id: Radio.request('application', 'session').get('id')
		}), true );

		Radio.trigger('game', 'move:waiting');
	},

	onShow: function() {
		Radio.trigger('game', 'check:winner');
	},
	/**
	 * Draw all moves historically
	 * @return {[type]} [description]
	 */
	drawMoves: function() {

	},

	/**
	 * Adds a New Move
	 */
	addMove: function() {

	}

});
