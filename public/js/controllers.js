function tradesController( $scope, $location, UserSvc ) {


	protectController( UserSvc, $scope, $location );

	$scope.acceptTrade = ( tradeId ) => {
		UserSvc.acceptTrade( tradeId )
			.then( $scope.updateTrades() )

	}

	$scope.cancelTrade = ( tradeId ) => {
		UserSvc.cancelTrade( tradeId )
			.then( $scope.updateTrades() )

	}

	$scope.fullfillTrade = ( tradeId ) => {
		UserSvc.fullfillTrade( tradeId )
			.then( $scope.updateTrades() )


	}

	$scope.updateTrades = () => {
		UserSvc.getTrades()
			.then( ( result ) => {
				$scope.trades = result
			} )
	}

	$scope.updateTrades()
}


function headerController( $scope, UserSvc ) {

	UserSvc.forceCheck()
		.then( ( user ) => {
				$scope.user = user.twitter
			},
			( error ) => {
				console.log( error )
			}
		);

}

function userController( $scope, $location, UserSvc, GoogleBookService ) {

	$scope.userbooks = [];
	protectController( UserSvc, $scope, $location );

	UserSvc.forceCheck()
		.then( ( user ) => {
			$scope.user = user
			$scope.userbooks = user.books;
			$scope.searchTerm = "jQuery";


			$scope.addBook = ( item ) => {
				$scope.bookResults = [];
				$scope.userbooks.push( item );
				UserSvc.addBook( item );
			}

			$scope.removeBook = ( item ) => {
				removeFromArray( $scope.userbooks, item )
				UserSvc.removeBook( item );
			}




			$scope.doSearch = function () {
				GoogleBookService.get( { q: $scope.searchTerm }, function ( response ) {

					$scope.bookResults = response.items;
					//$scope.orderProp = 'volumeInfo.title';

				} );
			}
		} );

}


function settingsController( $scope, UserSvc, $location ) {
	protectController( UserSvc, $scope, $location );

	UserSvc.forceCheck()
		.then( ( user ) => {
			$scope.user = user;
			$scope.userName = user.fullName;
			$scope.city = user.city;
			$scope.state = user.state;


		} )

	$scope.update = () => {
		var ret = {};
		ret.fullName = $scope.userName || '';
		ret.city = $scope.city || '';
		ret.state = $scope.state || '';
		UserSvc.update( ret );
	}
}

function indexController( $location, $scope, BookAPI ) {

	BookAPI.getNumberOfIndexPages()
		.then( pages => {
			$scope.numberOfPages = pages;
		} )

	BookAPI.getBooks( 1 )
		.then( books => {
			$scope.books = books;
		} )

	$scope.getBooksAtPage = function ( page ) {
		BookAPI.getBooks( page )
			.then( books => {
				$scope.books = books;
			} )
	}

	$scope.showBook = ( book ) => {
		$location.path( "/book/" + book.googleId )

	}


}

function BookInfoController( $routeParams, $scope, GoogleBookService, BookAPI ) {

	GoogleBookService.get( { q: $routeParams.id }, function ( response ) {
		$scope.book = ( response.items[ 0 ] )
	} )

	BookAPI.usersHavingBook( $routeParams.id )
		.then( ( result ) => {
				$scope.users = result;
			},
			( error ) => { console.log( "error: " + JSON.stringify( error ) ) } )


}





function otherUserController( $routeParams, $scope, $rootScope, UserSvc ) {
	$scope.tradePanelToggle = false;
	UserSvc.forceCheck()
		.then( user => {

				$scope.loggedUser = user

			},
			error => {
				$scope.loggedUser = false;

			} )
	UserSvc.getSomeUser( $routeParams.id )
		.then( ( result ) => {
			$scope.user = result;
			$scope.user.displayName = result.fullName || result.twitter.displayName;
		} )

	$scope.showTradePanel = ( event, book ) => {
		var elem = event.currentTarget || event.srcElement
		$scope.targetBook = book;
		$scope.tradePanelToggle = true;
		$rootScope.$broadcast( 'masonry.reload' );
	}

	$scope.requestTrade = ( book ) => {
		UserSvc.askTrade( $scope.targetBook, book, $routeParams.id )
		$scope.closeTradePanel();
	}


	$scope.closeTradePanel = () => {
		$scope.tradePanelToggle = false;
		$scope.targetBook = undefined;
	}
}

function protectController( UserSvc, $location, $scope ) {
	UserSvc.forceCheck()
		.then( ( user ) => {
				$scope.user = user
			},
			( error ) => {
				$location.path( "/" )
			}
		);

}


function removeFromArray( array, value ) {
	var idx = array.indexOf( value );
	if ( idx !== -1 ) {
		array.splice( idx, 1 );
	}
	return array;
}
