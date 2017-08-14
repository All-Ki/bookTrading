var mon = require('mongoose');
var Schema = mon.Schema;
var findOrCreate = require('mongoose-find-or-create')

var Book = new mon.Schema({
googleId : String,
thumb : String,
refCount : {required : true,type : Number, default : 0}
})
Book.plugin(findOrCreate);
module.exports = mon.model('Book',Book);
