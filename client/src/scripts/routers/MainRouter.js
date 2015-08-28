var Router = require('../libs/common/Router'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	Radio = require('backbone.radio'),
	Promise = require('bluebird');

module.exports = Router.extend({
	routes: {
		'*all': { uses: 'MainController@index' }
	},
	filters: {
	}
});
