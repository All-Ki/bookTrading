'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var book = require('./book.js')
var trade = require('./trade.js')
var User = new Schema({
	 twitter: {
		 	id : String,
			displayName : String
	 },
	 fullName : String,
	 city : String,
	 state : String,
	 books : [book.schema],

});

module.exports = mongoose.model('User', User);
