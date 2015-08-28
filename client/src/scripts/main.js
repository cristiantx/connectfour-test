// Vendors
var $ = require('jquery'),
	_ = require('underscore'),
	Application = require('./application');

window.console = window.console || { log: function() {}, debug: function() {} }; // Needed for IE.

// App Bootstrap.
var app = new Application();
app.start();
module.exports = app;
