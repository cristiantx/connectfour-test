var Backbone = require('backbone'),
	Collection = require('../libs/common/Collection'),
	Move = require('../models/Move');

module.exports = Collection.extend({
    model: Move,
    comparator: 'id'
});
