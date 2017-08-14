var users = require( '../models/users.js' )
var books = require( '../models/book.js' )
var request = require( 'request' )
var booksPerPage = 100;

module.exports = {
	addBook: ( book, userid ) => {
		users.findById( userid, ( err, user ) => {
			books.findOrCreate( { googleId: book.id }, ( err, item, created ) => {
				if ( err ) console.log( err );
				if ( created ) {
					setupBook( item, user )
				} else {
					increaseRefCount( item, user );
				}
			} )
		} )
	},



	removeBook: ( book, user ) => {
		books.find( { googleId: book.googleId },
			( err, book ) => {
				book.refCount -= 1;
				book.save();
			} )
		users.findById( user,
			( err, found ) => {
				found.books = removeFromArray( found.books, book.googleId );
				found.save();

			} )
	},

	allAvailableBooks: ( offs ) => {
		return new Promise( ( resolve, reject ) => {
			if ( !offs ) { offs = 0; }
			books.find()
				.where( 'refCount' )
				.gt( 0 )
				.limit( booksPerPage )
				.skip( booksPerPage * offs )
				.exec( ( err, result ) => {
					if ( err ) return reject( err );
					resolve( result );

				} )

		} )
	},
	availableBooksPageAmount: () => {
		return new Promise( ( resolve, reject ) => {
			books.find()
				.where( 'refCount' )
				.gt( 0 )
				.count( function ( err, count ) {
					if ( err ) return reject( err );
					resolve( Math.ceil( count / booksPerPage ) );

				} )
		} )

	},
	usersHavingBook: ( id ) => {
		return new Promise( ( resolve, reject ) => {
			users.find( { 'books.googleId': id } )
				.then(
					( result, err ) => {
						if ( err ) return reject( err );
						var ret = buildClientUserData( result );
						return resolve( ret );
					}
				)
		} )
	}



}

function buildClientUserData( userList ) {
	var ret = []
	for ( var i = 0; i < userList.length; i++ ) {
		var user = userList[ i ];

		var newUser = {
			_id: user._id,
			displayName: getUserName( user )
		}
		ret.push( newUser )
	}
	return ret
}

function setupBook( item, user ) {
	//TODO  : add .env googlekey
	request( 'https://www.googleapis.com/books/v1/volumes/' + item.googleId +
		'?key=AIzaSyATldFLGtPPZVLecasP0nFXkX6RqXa7VEI',
		function ( err, response, body ) {
			body = JSON.parse( body )
			item.thumb = body.volumeInfo.imageLinks.smallThumbnail
			item.title = body.volumeInfo.title
			item.refCount += 1;
			user.books.push( item );
			user.save();
			item.save();
		} )
}

function getUserName( user ) {
	return user.fullName || user.twitter.displayName;
}

function increaseRefCount( book, user ) {
	book.refCount += 1;
	user.books.push( book );
	user.save();
	book.save();
}

function removeFromArray( array, value ) {
	function f( x ) {
		return x.googleId == value;
	}
	var idx = array.findIndex( f );
	array.splice( idx, 1 );
	return array;
}
