'use strict';

	var TwitterStrategy = require( 'passport-twitter' )
		.Strategy;
var User = require( '../models/users' );
var configAuth = require( './auth' );

module.exports = function ( passport ) {
	passport.serializeUser( function ( user, done ) {
		done( null, user.id );
	} );

	passport.use( new TwitterStrategy(
		{
			consumerKey: configAuth.twitterAuth.consumerKey,
			consumerSecret: configAuth.twitterAuth.consumerSecret,
			callbackURL: configAuth.twitterAuth.callbackURL
		},
		function ( token, tokenSecret, profile, done ) {
			User.findOne( { 'twitter.id' : profile.id }, function ( err, user ) {

				if ( err ) {
					return done( err );
				}

				if ( user ) { console.log(user);return done( null, user ); }
				 else {
					console.log("new user");
					var newUser = new User();
					newUser.twitter.id = profile.id;
					newUser.twitter.displayName = profile.displayName;

					newUser.save( function ( err ) {
						if ( err ) {throw err;}
						return done( null, newUser );
					} );
				}
			} )
		}
	)
);


	passport.deserializeUser( function ( id, done ) {
		User.findById( id, function ( err, user ) {
			done( err, user );
		} );
	} );
};
