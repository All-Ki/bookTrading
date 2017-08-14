app.factory( 'UserSvc', function ( $http, $q ) {

		return {
			user: false,

			forceCheck: function () {
				var deferred = $q.defer();
				$http.get( '/loggedin' )
					.then( ( d ) => {
						this.user = d.data;
						resolveBooks( this.user, $http )
							.then( () => {
								deferred.resolve( this.user );
							} )
					}, ( status ) => {
						deferred.reject( status )
					} )

				return deferred.promise;
			},

			update: function ( data ) {
				$http.post( "/updateUser", data );
			},

			addBook: function ( book ) {
				$http.post( '/addBook', book );
				console.log( 'added' )
			},

			removeBook: function ( book ) {
				$http.post( '/removeBook', book );
				console.log( 'removed' )
			},

			getSomeUser: function ( id ) {
				var deferred = $q.defer()
				$http.get( '/user/' + id )
					.then( ( result ) => {
						deferred.resolve( result.data )
					} )
				return deferred.promise;

			},
			askTrade: function ( targetBook, offeredBook, targetUser ) {
				var deferred = $q.defer();

				var postItem = JSON.stringify( {
					targetUser: targetUser,
					targetBook: targetBook,
					offeredBook: offeredBook,
					//owner checked server-side
				} )
				$http.post( '/askTrade', postItem )
					.then( result => {
						deferred.resolve( result );
					} );
				return deferred.promise;

			}
			,
			getTrades : function(){
				var deferred = $q.defer();
				$http.get('/userTrades').then((result)=>{
					console.log(result.data);
					return deferred.resolve(result.data)
				})
				return deferred.promise;
			},
				acceptTrade : function(tradeId){
					var deferred = $q.defer();
					$http.get('/acceptTrade/'+tradeId).then((result)=>{
						console.log(result.data);
						return deferred.resolve(result.data)
					})
					return deferred.promise
				},
				cancelTrade : function(tradeId){
					var deferred = $q.defer();
					$http.get('/cancelTrade/'+tradeId).then((result)=>{
						console.log(result.data);
						return deferred.resolve(result.data)
					})
					return deferred.promise
				},
				fullfillTrade  :function(tradeId){
					var deferred = $q.defer();
					$http.get('/fullfillTrade/'+tradeId).then((result)=>{
						console.log(result.data);
						return deferred.resolve(result.data)
					})
					return deferred.promise
				}

			}
		
	} )
	.factory( 'GoogleBookService', function ( $resource ) {
		return $resource( 'https://www.googleapis.com/books/v1/volumes', { maxResults: '40', key: 'AIzaSyATldFLGtPPZVLecasP0nFXkX6RqXa7VEI' }, {
			get: { method: 'JSONP' }
		} );
	} )
	.factory( 'BookAPI', function ( $http, $q ) {
		return {

			usersHavingBook: function ( googleId ) {
				var deferred = $q.defer();
				$http.get( "usersHavingBook/" + googleId )
					.then( ( results ) => {
						deferred.resolve( results.data );
					}, ( error ) => { deferred.reject( error ) } )
				return deferred.promise;
			},

			getBooks: function ( offset ) {
				offset = offset - 1 || 0;
				var deferred = $q.defer();
				$http.get( '/indexBooks/' + offset )
					.then( ( results ) => {
						deferred.resolve( results.data );
					} )
				return deferred.promise;
			},

			getNumberOfIndexPages: function () {
				var deferred = $q.defer();
				$http.get( '/getNumberOfPages' )
					.then( ( res ) => {
							deferred.resolve( res.data.pages )
						},
						error => {
							deferred.reject( error )
						} )
				return deferred.promise;
			}

		}

	} )



function resolveBooks( user, $http ) {
	return new Promise( ( resolve, reject ) => {
		Promise.all(
				user.books.map( book => {
					$http.get( 'https://www.googleapis.com/books/v1/volumes/' + book.googleId +
							'?key=AIzaSyATldFLGtPPZVLecasP0nFXkX6RqXa7VEI' )
						.then( ( res ) => {
							Object.assign( book, res.data );
						} )
				} )
			)
			.then( result => {
				resolve();
				// all resolved users are in result
			} );
	} )
}
