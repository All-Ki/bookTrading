module.exports = (app) => {

  var path = require( 'path' );
  var logger = require( 'morgan' )
  var express = require( 'express' );
  var mongoose = require( 'mongoose' );
  var session = require( 'express-session' );
  var bp = require( 'body-parser' );
  var passport = require( 'passport' );



  app.use( '/public', express.static( path.join( __dirname, '/public' ) ) )
  app.use( '/bower_components', express.static( path.join( __dirname, '/bower_components' ) ) );
  app.locals.basedir = __dirname;
  mongoose.connect( process.env.MONGO_URI );
  mongoose.Promise = global.Promise;

  app.use( bp.json() );
  app.use( bp.urlencoded( { extended: true } ) );
  app.use( express.static( path.join( __dirname, 'public' ) ) );
  app.use( logger( 'dev' ) )



  app.use( session( {
  	secret: 'secretClementine',
  	resave: false,
  	saveUninitialized: true
  } ) );

  app.use( passport.initialize() );
  app.use( passport.session() );


}
