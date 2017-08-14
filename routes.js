var userMgr = require( './app/controllers/UserMgr.js' )
var bookMgr = require( './app/controllers/BookMgr.js' )

exports.index = ( req, res ) => {
	res.sendFile( __dirname + '/public/index.html' );
}
exports.numberOfPages = ( req, res ) => {
	bookMgr.availableBooksPageAmount()
		.then( ( count ) => {
			res.json( { pages: count } )
		} )
}

exports.indexBooks = ( req, res ) => {
	var pageOffset = req.params.offset;
	bookMgr.allAvailableBooks( pageOffset )
		.then( ( books ) => {
			res.json( books );
		} )

}

exports.getUser = ( req, res ) => {
	var id = req.params.id
	userMgr.getUser( id )
		.then( ( user ) => {
			res.json( user );
		} )
}

exports.updateUser = ( req, res ) => {
	userMgr.updateUser( req.body, req.user._id );
}

exports.addBook = ( req, res ) => {
	bookMgr.addBook( req.body, req.user._id )
	res.sendStatus( 200 )
}

exports.usersHavingBook = ( req, res ) => {
	var book = req.params.id;

	bookMgr.usersHavingBook( book )
		.then( ( result ) => {
				res.json( result )
			},
			( error ) => {
				res.sendStatus( 404 )
			} )
}


exports.userTrades = (req,res)=>{
	if(req.isAuthenticated()){
userMgr.userTrades(req.user._id)
.then((data)=>{
	res.json(data)
})
}

}


exports.askTrade = ( req, res ) => {
	if ( req.isAuthenticated() ) {
		var data = req.body;
		var asker = req.user._id;
		var request = {
			user: data.targetUser,
			book: data.targetBook
		}
		var offer = {
			user: req.user._id,
			book: data.offeredBook
		}

		userMgr.requestTrade( request, offer );
		res.sendStatus(200)
	}
}

exports.acceptTrade = (req,res) =>{
	if(req.isAuthenticated()){
		userMgr.acceptTrade(req.params.id , req.user._id)
		res.sendStatus(200)

	}
}
exports.removeTrade = (req,res)=>{
	if(req.isAuthenticated()){
		userMgr.removeTrade(req.params.id,  req.user._id)
		res.sendStatus(200)
	}
}
exports.fullfillTrade = (req,res)=>{
	if(req.isAuthenticated()){
		userMgr.fullfillTrade(req.params.id , req.user._id)
		res.sendStatus(200)

	}
}



exports.removeBook = ( req, res ) => {
	bookMgr.removeBook( req.body, req.user._id );
}
