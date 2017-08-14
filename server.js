'use strict';
var express = require('express')
require( 'dotenv' ).load();
var passport = require( 'passport' );
require( './app/config/passport' )( passport );
var app = express();
var routes = require( './routes.js' );
require('./serverSetup.js')(app)



app.get( '/', routes.index )
app.post("/updateUser",routes.updateUser)
app.post("/addBook",routes.addBook)
app.get( '/loggedin', auth)
app.get('/getNumberOfPages',routes.numberOfPages)
app.get('/indexBooks/:offset',routes.indexBooks)
app.get('/usersHavingBook/:id',routes.usersHavingBook)
app.get('/user/:id',routes.getUser)
app.post('/askTrade',routes.askTrade)
app.get('/userTrades',routes.userTrades)
app.get('/acceptTrade/:id',routes.acceptTrade)
app.get('/fullfillTrade/:id',routes.fullfillTrade)
app.get('/cancelTrade/:id',routes.removeTrade)


app.route( '/auth/twitter' )
	.get( passport.authenticate( 'twitter' ) );

app.route( '/auth/twitter/callback' )
	.get( passport.authenticate( 'twitter', {
		successRedirect: '/',
		failureRedirect: '/login'
	} ) );




function auth  ( req, res ) {
	if ( req.isAuthenticated() ) {
		res.json( req.user )
	} else {
		res.sendStatus( 401 );
	}
}




var port = process.env.PORT || 8080;
app.listen( port, function () {
	console.log( 'Node.js listening on port ' + port + '...' );
} );
