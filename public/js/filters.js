app.filter( 'formatFilter', function () {
		return function ( text ) {
			if ( text !== null ) {
				for ( var i in text ) { var authors = text[ i ] }
				return authors;
			}
		};
	} )
	.filter( 'dateFilter', function () {
		return function ( text ) {
			if ( text !== null ) {
				var d = new Date( text );
				var day = d.getDate();
				var month = d.getMonth() + 1;
				var year = d.getFullYear();
				return ( month + "/" + day + "/" + year );
			}
		};
	} )
	.filter( 'pageRange', function () {
		return function ( input, total ) {
			total = parseInt( total );

			for ( var i = 1; i <= total; i++ ) {
				input.push( i );
			}

			return input;
		};
	} );
