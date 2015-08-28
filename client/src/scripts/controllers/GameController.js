var Radio = require('backbone.radio'),
	_ = require('underscore'),
	Promise = require('bluebird'),
	AppController = require('./AppController');

var Moves = require('../collections/Moves'),
	Move = require('../models/Move');

// Start Local Class
module.exports = AppController.extend({
	player: {},
	game: {},
	state: null,
	boardArray: [],
	initialize: function() {

		AppController.prototype.initialize.apply(this, arguments); // Call Parent Method.
		this.channel = Radio.channel('game');

		this.moves = new Moves();
		this.initializeBoard();

		this.channel.reply({
			'info': this.getGame,
			'moves': this.getMoves,
			'state': this.getState
		}, this );

		this.channel.on({
			'move:add': this.addMove,
			'move:waiting': this.onWaitingMove,
			'load': this.onLoadGame,
			'status:updated': this.onStatusUpdated,
			'check:winner': this.checkWinner
		}, this );

		this.player = Radio.request('application', 'session');
		console.log( 'player', this.player );

	},
	getState: function() {
		return this.state;
	},
	updateGameState: function() {
		var previous_state = this.state;

		if( this.game.get('player_turn_id') != Radio.request('application', 'session').get('id') ) {
			this.state = 'waiting';
		} else {
			this.state = 'play';
		}

		if( previous_state !== this.state ) {
			this.channel.trigger('status:updated');
		}


	},
	onStatusUpdated: function() {

		if( this.state == 'waiting' ) {
			this.checkTimeout = setTimeout( _.bind( this.checkStatus, this ), 1000 );
		}

	},
	checkStatus: function() {
		console.log( 'Checking Status' );
		this.game.fetch().then(_.bind( function( data ) {

			this.updateGameState();
			this.onStatusUpdated();

			if( this.moves.length < data.moves.length ) {
				var move = new Move( _.last( data.moves ) );
				this.addMove(move);
			}

		}, this ));
	},
	onWaitingMove: function() {
		this.state = 'waiting';
	},
	onLoadGame: function( game ) {
		this.game = game;
		this.updateGameState();
		console.log('Game Loaded');

		_.each( game.get('moves'), function( move ) {
			var move = new Move( move );
			this.addMove(move);
		}, this);

	},
	initializeBoard: function() {
		// Initialize Empty Game Board, 6x7 just for easier management.
		this.boardMatrix = [
			[ 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0 ],
			[ 0, 0, 0, 0, 0, 0 ]
		];
	},
	checkWinner: function() {

		var winner = this.checkRowWinner() || this.checkColumnWinner() || false;

		if( winner !== false ) {
			this.channel.trigger('winner', winner );
		}

		return winner;
	},
	checkRowWinner: function() {

		var prev = null, count = 0, winner = false;


		// Moving Rows
		for( var i = 0; i < 6; i++ ) {

			// Moving Columns
			for( var j = 0; j < 7; j++ ) {

				if( this.boardMatrix[j][i] == 0 ) return;

				if( prev != this.boardMatrix[j][i] ) {
					prev = this.boardMatrix[j][i];
					count = 1;
				} else {
					count++;
				}

				if( count == 4 ) {
					winner = prev;
					break;
				}

			}
			if(winner) break;
		}

		return prev;

	},
	checkColumnWinner: function() {

		var prev = null, count = 0, winner = false;

		_.each( this.boardMatrix, function( row ) {

			if(winner) return;

			_.each( row, function( item ) {
				if(winner) return;
				if( item == 0 ) return;

				if( prev != item ) {
					prev = item;
					count = 1;
				} else {
					count++;
				}

				if( count == 4 ) {
					winner = prev;
				}

			}, this )
		}, this );

		return winner;

	},
	checkDiagonalWinner: function() {

		var prev = null, count = 0, winner = false;

		if( item == 0 ) return;
		// Moving Rows
		for( var i = 0; i < 6; i++ ) {

			// Moving Columns
			for( var j = 0; j < 7; j++ ) {

				if( prev != this.boardMatrix[j][i] ) {
					prev = this.boardMatrix[j][i];
					count = 1;
				} else {
					count++;
				}

				if( count == 4 ) {
					winner = true;
					break;
				}

			}
			if(winner) break;
		}

		return winner;

	},
	startGame: function() {

	},
	getGame: function() {
		console.log('Getting Game Object');
		return this.game;
	},
	getMoves: function() {
		console.log('Getting Game Moves');
		return this.moves;
	},
	/**
	 * Add Move to Collection and Matrix,
	 * Returns the position to be drawed.
	 */
	addMove: function( move, persist ) {

		console.log( 'adding move', move );
		var details = this.addMoveToMatrix( move.get('column'), move.get('player_id') );
		move.set('coordinates', details );
		this.moves.add( move );

		if( persist === true ) {

			var winner = this.checkWinner();

			if( winner ) {
				this.game.set('status', winner );
				this.game.save().then( _.bind(function() {
					move.save().then( function() { });
				}, this) );
			} else {
				move.save().then( function() { });
			}



			if( !winner ) {
				this.changeTurn();
			} else {
				this.endGame();
			}


		}

	},
	changeTurn: function() {

		if( Radio.request('application', 'session').get('id') == this.game.get('player1_id') ) {
			this.game.set('player_turn_id', this.game.get('player2_id') );
		} else {
			this.game.set('player_turn_id', this.game.get('player1_id') );
		}

		this.updateGameState();

	},
	addMoveToMatrix: function( column, player_id ) {

		var currentColumn = this.boardMatrix[ column ],
			nextPosition;

		_.each( currentColumn, function( item, index ) {
			//console.log( index );
			if( item !== 0 ) {
				return;
			} else {
				nextPosition = index;
			}
		} );

		this.boardMatrix[column][nextPosition] = player_id;

		return {
			column: column,
			row: nextPosition
		}

	}

});
