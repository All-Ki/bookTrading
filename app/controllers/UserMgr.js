var users = require( '../models/users.js' )
var trades = require( '../models/trade.js' )

module.exports = {
updateUser: function ( data, id ) {
	users.findById( id, ( err, user ) => {
		user.fullName = data.fullName;
		user.city = data.city;
		user.state = data.state;
		user.save();
	} )

},
getUser: function ( id ) {
	return new Promise( ( resolve, reject ) => {
		users.findById( id, ( err, user ) => {
			if ( err ) return reject( err )
			return resolve( user )
		} )

	} )
},

requestTrade: function ( request, offer ) {
	return new Promise( ( resolve, reject ) => {
		var trade = {
			asker: offer.user,
			target: request.user,
			askedBook: itemToBookSchema(request.book),
			offeredBook: itemToBookSchema(offer.book)
		}
console.log(trade)
		trades.findOrCreate( trade, ( err, newtrade, created ) => {
			console.log(newtrade)
			if ( created ) {} else {
				//nothing to do here
			}
		} )
	} )
},

userTrades: function ( userId ) {
	return new Promise( ( resolve, reject ) => {
		trades.find( { asker: userId }, ( err, askedTrades ) => {
			trades.find( { target: userId }, ( err, pendingTrades ) => {
				if ( err ) return reject( err )
				var ret = {
					askedTrades: askedTrades,
					pendingTrades: pendingTrades
				}
				return resolve(ret )
			} )
		} )
	} )
},
acceptTrade: function ( tradeId, userId ) {
	trades.findById( tradeId, function ( err, trade ) {
		if ( trade.target == userId ) {
			trade.accepted = true;
			trade.save();
		}
	} )
},
fullfillTrade: function ( tradeId, userId ) {
	trades.findById( tradeId, ( err, trade ) => {
		if ( trade.asker == userId ) {
			trade.fullfilledByTarget = true;
		} else  if(trade.target==userId){
			trade.fullfilledByAsker = true;
		}
		if ( trade.fullfilledByAsker && trade.fullfilledByTarget ) {
			removeTrade( tradeId, userId );
		}
		trade.save()
	} )
},
removeTrade: ( tradeId, userId ) => {
	trades.findById( tradeId, ( err, trade ) => {
		if ( userId == trade.asker || userId == trade.target ) {
			trade.remove( trade );
		}
	} )
}

}
function itemToBookSchema(item){
	return{
		googleId : item.googleId,
		_id : item._id,
		thumb : item.thumb,
		refCount : item.refCount
	}
}
