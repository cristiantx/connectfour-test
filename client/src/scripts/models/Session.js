var Backbone = require('backbone'),
	Model = require('../libs/common/Model'),
	_ = require('underscore'),
	Radio = require('backbone.radio'),
	$ = require('jquery'),
	Promise = require('bluebird');

module.exports = Model.extend({
    defaults: {
		language: 'en_US'
    },
    initialize: function() {

    }
});
