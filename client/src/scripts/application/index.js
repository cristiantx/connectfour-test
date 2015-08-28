var $ = require('jquery'),
	_ = require('underscore'),
	Radio = require('backbone.radio'),
	Backbone = require('backbone'),
	Marionette = require('backbone.marionette'),
	Router = require('../routers/MainRouter');

var Session = require('../models/Session');

var MainLayout = require('../views/MainLayout');

var MainController = require('../controllers/MainController'),
	GameController = require('../controllers/GameController');

module.exports = Marionette.Application.extend({

	initialize: function() {

		this.session = new Session( window.player );
		this.addInitializer( _.bind( this._layout, this ) );
		this.addInitializer( _.bind( this._detectDevice, this ) );
		this.addInitializer( _.bind( this._listeners, this ) );
		this.addInitializer( _.bind( this._routes, this ) );
		this.addInitializer( _.bind( this._historyInitialize, this ) );

	},

	_historyInitialize: function () {
		Backbone.history.start();
	},

	_layout: function() {

		this.rootView = new MainLayout();
		this.rootView.render();

	},

	_routes: function() {

		this.router = new Router({
			controllers: {
				'GameController': new GameController(),
				'MainController': new MainController()
			}
		});

	},

	_listeners: function() {
		this.channel = Radio.channel('application');
		this.channel.reply('instance', _.bind( this._getApplication, this ));
		this.channel.reply('session', _.bind( this._getSession, this ));
	},

	_getApplication: function() {
		return this;
	},

	_getSession: function() {
		return this.session;
	},

	_detectDevice: function() {

		var device = 'desktop';

		if( (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera) ) {
			device = 'mobile';
		}

		$('html').addClass( device );

		return device;

	}

});


