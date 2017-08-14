var mon = require('mongoose');
var Schema = mon.Schema;
var  Book = require('./book.js').schema
var findOrCreate = require('mongoose-find-or-create')

var Trade = new Schema({
asker :String,
target :String,
askedBook :Book,
offeredBook :Book,
accepted : {type : Boolean, default : false},
fullfilledByTarget: {type : Boolean, default : false},
fullfilledByAsker : {type : Boolean, default : false}

})
Trade.plugin(findOrCreate);
module.exports = mon.model('Trade',Trade)
