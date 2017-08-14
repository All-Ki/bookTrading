var app = angular.module( 'bookTrading', ['ui.bootstrap','ngResource', 'dcbImgFallback','wu.masonry', 'ngRoute' ] )
	.config( [ '$routeProvider',
		function ( $routeProvider ) {
			$routeProvider.
			when( '/', {
					templateUrl: 'partials/index.html',
					controller: indexController
				} )
        .when('/user',{
          templateUrl : 'partials/user.html',
          controller : userController
        })
				.when("/settings",{
          templateUrl : 'partials/settings.html',
          controller : settingsController
        }).when('/book/:id',{
					templateUrl : 'partials/book.html',
					controller : BookInfoController
				})
				.when('/user/:id',{
					templateUrl : 'partials/otherUser.html',
					controller : otherUserController
				})
				.when('/trades',{
					templateUrl : 'partials/trades.html',
					controller : tradesController

				})
				.otherwise( '/' )

		}
	] )
	.controller( 'indexController', indexController )
  .controller( 'userController', userController )
  .controller( 'headerController', headerController )
	.controller('BookInfoController', BookInfoController)
	.controller('otherUserController', otherUserController)
	.controller('tradesController',tradesController)
	.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
	    // Allow same origin resource loads.
	    'self',
	    // Allow loading from our assets domain. **.
	    'https://www.googleapis.com/**'
	  ]);
	})


function isLoggedIn(UserSvc,$location){
UserSvc.forceCheck().then((user)=>{
	if(user){return;}
	else{$location.path("/")}
},
(error)=>{
	$location.path('/');
})
}
