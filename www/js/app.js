// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'uiGmapgoogle-maps', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.directive("starRating", function() {
  return {
    restrict : "EA",
    template : "<ul class='rating' ng-class='{readonly: readonly}'>" +
               "  <li ng-repeat='star in stars' ng-class='star' ng-click='toggle($index)'>" +
               "    <i class='fa fa-star'></i>" + //&#9733
               "  </li>" +
               "</ul>",
    scope : {
      ratingValue : "=ngModel",
      max : "=?", //optional: default is 5
      onRatingSelected : "&?",
      readonly: "=?"
    },
    link : function(scope, elem, attrs) {
      if (scope.max == undefined) { scope.max = 5; }
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < scope.max; i++) {
          scope.stars.push({
            filled : i < scope.ratingValue
          });
        }
      };
      scope.toggle = function(index) {
        if (scope.readonly == undefined || scope.readonly == false){
          scope.ratingValue = index + 1;
          scope.onRatingSelected({
            rating: index + 1
          });
        }
      };
      scope.$watch("ratingValue", function(oldVal, newVal) {
        if (newVal) { updateStars(); }
      });
    }
  };
})

.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
  $stateProvider

   .state('login', {
    controller: 'LoginCtrl',
    url: '/login',
    templateUrl: 'templates/login.html'
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.findPOI', {
    cache: false,
    url: "/findPOI",
    views: {
      'menuContent': {
        templateUrl: "templates/findPOI.html",
        controller: 'FindPOICtrl'
      }
    }
  })

  .state('app.stat', {
    url: "/stat",
    views: {
      'menuContent': {
        templateUrl: "templates/stat.html",
        controller: 'StatCtrl'
      }
    }
  })

  .state('app.popularLoc', {
    url: "/popularloc",
    views: {
      'menuContent': {
        templateUrl: "templates/popularloc.html",
        controller: 'PopularCtrl'
      }
    }
  })

  .state('app.bestrateLoc', {
    url: "/bestrateloc",
    views: {
      'menuContent': {
        templateUrl: "templates/bestrateloc.html",
        controller: 'BestRateCtrl'
      }
    }
  })

  .state('app.popularIssue', {
    url: "/popularissue",
    views: {
      'menuContent': {
        templateUrl: "templates/popularissue.html",
        controller: 'PopularIssueCtrl'
      }
    }
  })

  .state('app.history', {
    url: "/history",
    views: {
      'menuContent': {
        templateUrl: "templates/history.html",
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.registered]
    },
  })

  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",
      }
    }
  })

  .state('app.checkin', {
    cache: false,
    url: "/checkin",
    views: {
      'menuContent': {
        templateUrl: "templates/checkin.html",
        controller: 'CheckinCtrl'
      }
    }
    ,
    data: {
      authorizedRoles: [USER_ROLES.registered]
    }
  })

  .state('app.addLocation', {
    url: "/add",
    views: {
      'menuContent': {
        templateUrl: "templates/addlocation.html",
        controller: 'AddLocationCtrl'
      }
    }
    ,
    data: {
      authorizedRoles: [USER_ROLES.registered]
    }
  })

  .state('app.rate', {
    url: "/rate/:locationId",
    views: {
      'menuContent': {
        templateUrl: "templates/rate.html",
        controller: 'RateCtrl'
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.registered]
    }
  })

  .state('app.location', {
    url: "/location/:locationId",
    views: {
      'menuContent': {
        templateUrl: "templates/location.html",
        controller: 'LocationCtrl'
      }
    }
  })

  .state('app.playlists', {
    url: "/playlists",
    views: {
      'menuContent': {
        templateUrl: "templates/playlists.html",
        controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.single', {
    url: "/playlists/:playlistId",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})


.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
    if ('data' in next && 'authorizedRoles' in next.data) {

      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }
    /*
    if (!AuthService.isAuthenticated() ) {
      if (next.name !== 'findPOI') {
        event.preventDefault();
        $state.go('login');
      }
    } */
  });
})
;
