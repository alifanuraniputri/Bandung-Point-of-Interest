angular.module('starter.controllers', ['uiGmapgoogle-maps', 'ngCordova'])

.controller('AppCtrl', function($state, $scope, $ionicPopup, $ionicModal, $timeout, AuthService, AUTH_EVENTS) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.logout = function() {
    AuthService.logout();
    $scope.user.username='';
    $scope.user.name='Guest';
    $scope.user.id='';
    $state.go('login');
  };

  $scope.user = {};

  $scope.update = function () {
    $scope.user.username = AuthService.username();
    $scope.user.name = AuthService.name();
    $scope.user.id = AuthService.id();
  }

  $scope.update();

 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 

  
  
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('Publictrl', function($scope) {
  })

.controller("RateCtrl", function($state, $stateParams, $scope, $ionicPopup, $ionicHistory, RestService, ConnService, AuthService) {

  $scope.loadLocation = function () { 
    RestService.locationGet($stateParams.locationId).then( function (data) {
        $scope.location = data;
    })
  };
  $scope.loadLocation();

  $scope.ratingAll = 1;
  $scope.rating1 = 1;
  $scope.rating2 = 1;
  $scope.rating3 = 1;
  $scope.rating4 = 1;
  $scope.rating5 = 1;

  $scope.rateFunction = function(c1,c2,c3,c4,c5,ov) {

    RestService.checkin(AuthService.id(),$stateParams.locationId).then( function (data) {
       
    })

    RestService.rating(AuthService.id(),$stateParams.locationId,c1,c2,c3,c4,c5,ov).then( function (data) {

        if (data.user.id==AuthService.id()) {
          var alertPopup = $ionicPopup.alert({
              title: 'Rating Submitted!',
          });
          alertPopup.then(function(res) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('app.history', {}, {reload: true});
           });
        } else {
          var alertPopup = $ionicPopup.alert({
              title: 'Rating Failed!',
          });
          alertPopup.then(function(res) {
            $state.go('app.checkin');
           });
        }
       
    })

    
  };

  $scope.checkinFunction = function() {

    RestService.checkin(AuthService.id(),$stateParams.locationId).then( function (data) {

        if (data.user.id==AuthService.id()) {
          var alertPopup = $ionicPopup.alert({
              title: 'Checkin Success!',
          });
          alertPopup.then(function(res) {
            $ionicHistory.nextViewOptions({
              disableBack: true
            });
            $state.go('app.history');
           });
        } else {
          var alertPopup = $ionicPopup.alert({
              title: 'Checkin Failed!',
          });
          alertPopup.then(function(res) {
            $state.go('app.checkin');
           });
        }
       
    })

    
  };

})

.controller("LocationCtrl", function($stateParams, $state, RestService, ConnService, $scope, $ionicPopup ) {

    $scope.loadLocation = function () { 
        RestService.locationGet($stateParams.locationId).then( function (data) {
            $scope.location = data;
        })
        RestService.locationRankGet($stateParams.locationId).then( function (data) {
            $scope.rank = data;
        })

    };
    $scope.loadLocation();
    $scope.isReadonly = true;
})

.controller("StatCtrl", function($state, RestService, ConnService, $scope, $ionicPopup ) {

    $scope.show = {
        park : true,
        hospital : true,
        mosque : true
    };

    $scope.loadStat = function () { 
        RestService.popularityList($scope.show.park,$scope.show.hospital,$scope.show.mosque).then( function (data) {
            $scope.popularity = data;
        })
        RestService.bestRatedList($scope.show.park,$scope.show.hospital,$scope.show.mosque).then( function (data) {
            $scope.bestRated = data;
        })
    };

    $scope.loadIssue = function () {
         RestService.issueList().then( function (data) {
            $scope.issue = data;
        })
    }

    $scope.loadIssue();
    $scope.loadStat();

})

.controller("PopularIssueCtrl", function($state, RestService, ConnService, $scope, $ionicPopup ) {

    $scope.loadIssue = function () {
         RestService.issueList().then( function (data) {
            $scope.issue = data;
        })
    }

    $scope.loadIssue();

})


.controller("PopularCtrl", function($state, RestService, ConnService, $scope, $ionicPopup ) {

    $scope.show = {
        park : true,
        hospital : true,
        mosque : true
    };
    $scope.loadStat = function () { 
        RestService.popularityList($scope.show.park,$scope.show.hospital,$scope.show.mosque).then( function (data) {
            $scope.popularity = data;
        })
    };
    $scope.loadStat();

})

.controller("BestRateCtrl", function($state, RestService, ConnService, $scope, $ionicPopup ) {

    $scope.show = {
        park : true,
        hospital : true,
        mosque : true
    };
    $scope.loadStat = function () { 
        RestService.bestRatedList($scope.show.park,$scope.show.hospital,$scope.show.mosque).then( function (data) {
            $scope.bestRated = data;
        })
    };
    $scope.loadStat();

})



.controller('FindPOICtrl', function($scope, $timeout, uiGmapGoogleMapApi, $state, $cordovaGeolocation, RestService, ConnService, AuthService) {
    //$scope.map = { center: { latitude: -6.924783191, longitude: 107.6091358}, zoom: 15, bounds: {} };
    
    $scope.parks = [];
    $scope.parkMarkers = [];
    $scope.hospitals = [];
    $scope.hospitalMarkers = [];
    $scope.mosques = [];
    $scope.mosqueMarkers = [];
    $scope.circles;
    $scope.mylat;
    $scope.mylng;
    $scope.show = {
       park : true,
       hospital : true,
       mosque : true
     };
    var pmarkersbound = [];
    var hmarkersbound = [];
    var mmarkersbound = [];

    $cordovaGeolocation
    .getCurrentPosition()
    .then(function (position) {
      $scope.mylat  = position.coords.latitude;
      $scope.mylng = position.coords.longitude;
      //  $scope.mylat  = -6.922783191;
       // $scope.mylng = 107.6081358;
        $scope.mylocation = {
          id: 0,
          coords: {
            latitude: $scope.mylat,
            longitude: $scope.lng,
          },
          options: { draggable: false,
            labelContent: "My Location",
                labelAnchor: "20 0",
                labelClass: "marker-labels",
               icon: {url: "./img/marker.png" ,scaledSize: new google.maps.Size(30, 44)},},
        };
        $scope.map = {center: {latitude: $scope.mylat, longitude: $scope.mylng }, zoom: 14, bounds: {} };
        $scope.circle = 
        {
          id: 1,
          center: {
              latitude: $scope.mylat,
              longitude: $scope.mylng
          },
          radius: 1300,
          stroke: {
              color: '#07D5DC',
              weight: 1,
              opacity: 1
          },
          fill: {
              color: '#fff',
              opacity: 0.5
          },
          geodesic: true, // optional: defaults to false
          //draggable: true, // optional: defaults to false
          clickable: true, // optional: defaults to true
          editable: true, // optional: defaults to false
          visible: true, // optional: defaults to true
          control: {},
          events:{
            radius_changed: function(){
                $scope.parkMarkers = [];  $scope.parkMarkers.length=0;
                $scope.hospitalMarkers = [];  $scope.hospitalMarkers.length=0;
                $scope.mosqueMarkers = [];  $scope.mosqueMarkers.length=0;
                pmarkersbound = []; pmarkersbound.length=0;
                hmarkersbound = []; hmarkersbound.length=0;
                mmarkersbound = []; mmarkersbound.length=0;
            }
          }
        }
        ;
        $scope.mylocation.coords.latitude = $scope.mylat;
        $scope.mylocation.coords.longitude = $scope.mylng;
    }, function(err) {
      // error
      alert('Error fetching position');
    });

    var createMarker = function(i, scp, img, idKey) {
     
      if (idKey == null) {
        idKey = "id";
      }
      var ret = {
        id: i,
        latitude: scp[i].lat,
        longitude:  scp[i].lng,
        labelContent: scp[i].name,
        labelAnchor: "20 0",
        icon:{url: img, scaledSize: new google.maps.Size(30, 44) },
        events: {
            click: function () {
              $state.go('app.location',{locationId:scp[i].id});
            }
          },
      };
      ret[idKey] = i;
      return ret;
    };

    $scope.loadParks = function () {
        RestService.parkList().then( function (data) {
            $scope.parks = data;
        }
    )};

    $scope.loadHospitals = function () {
        RestService.hospitalList().then( function (data) {
            $scope.hospitals = data;
        }
    )};

    $scope.loadMosques = function () {
        RestService.mosqueList().then( function (data) {
            $scope.mosques = data;
        }
    )};


    var rad = function(x) {
      return x * Math.PI / 180;
    };

    var getDistance = function(p1, p2) {
      var R = 6378137; // Earth’s mean radius in meter
      var dLat = rad(p2.lat() - p1.lat());
      var dLong = rad(p2.lng() - p1.lng());
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d; // returns the distance in meter
    };

    $scope.find = function() {

      $scope.parkMarkers = [];  $scope.parkMarkers.length=0;
      $scope.hospitalMarkers = [];  $scope.hospitalMarkers.length=0;
      $scope.mosqueMarkers = [];  $scope.mosqueMarkers.length=0;
      
       var p2 = new google.maps.LatLng($scope.circle.center.latitude, $scope.circle.center.longitude);

      console.log("scope find");
      if ($scope.show.park) {
        pmarkersbound = []; pmarkersbound.length=0;
          for (var i = 0; i < $scope.parks.length; i++) { 
              var p1 = new google.maps.LatLng($scope.parks[i].lat, $scope.parks[i].lng);
              if (getDistance(p1, p2)<$scope.circle.radius) {
                  pmarkersbound.push(createMarker(i, $scope.parks, "./img/park.png" ));
              }
          }
          $scope.parkMarkers = pmarkersbound; 
      }

      if ($scope.show.hospital) {
         hmarkersbound = []; hmarkersbound.length=0;
        for (var i = 0; i < $scope.hospitals.length; i++) { 
              var p1 = new google.maps.LatLng($scope.hospitals[i].lat, $scope.hospitals[i].lng);
              if (getDistance(p1, p2)<$scope.circle.radius) {
                  hmarkersbound.push(createMarker(i, $scope.hospitals, "./img/hospital.png" ));
              }
          }
          $scope.hospitalMarkers = hmarkersbound;
      }
      
      if ($scope.show.mosque) {
        mmarkersbound = []; mmarkersbound.length=0;
        for (var i = 0; i < $scope.mosques.length; i++) { 
              var p1 = new google.maps.LatLng($scope.mosques[i].lat, $scope.mosques[i].lng);
              if (getDistance(p1, p2)<$scope.circle.radius) {
                  mmarkersbound.push(createMarker(i, $scope.mosques, "./img/mosque.png" ));
              }
          }
          $scope.mosqueMarkers = mmarkersbound; 
      }
       
    };
   
    $scope.loadParks();
    $scope.loadHospitals();
    $scope.loadMosques();

})


.controller('CheckinCtrl', function($scope, $timeout, uiGmapGoogleMapApi, $state, $cordovaGeolocation, RestService) {
  
 // $scope.map = { center: { latitude: -6.924783191, longitude: 107.6091358}, zoom: 15, bounds: {} };

  var rad = function(x) {
    return x * Math.PI / 180;
  };

  var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };

  $scope.loadLocations = function () {
      RestService.locationList().then( function (data) {
          $scope.locations = data;
          $scope.countDistance();
      }
  )};

  $cordovaGeolocation
  .getCurrentPosition()
  .then(function (position) {
    var lat  = position.coords.latitude;
    var lng = position.coords.longitude;
    //var lat  = -6.924783191;
    //var lng = 107.6091358;
    $scope.map = {center: {latitude: lat, longitude: lng }, zoom: 15 };
      $scope.mylocation = {
      id: 0,
      coords: {
        latitude: lat,
        longitude: lng
      },
      options: { draggable: false,
        labelContent: "My Location",
            labelAnchor: "20 0",
            labelClass: "marker-labels",
           icon: {url: "./img/marker.png" ,scaledSize: new google.maps.Size(30, 44)},},
    };

     $scope.loadLocations();
  }, function(err) {
    // error
    alert('Error fetching position');
  });

  

  $scope.countDistance = function () {
    var p2 = new google.maps.LatLng($scope.mylocation.coords.latitude, $scope.mylocation.coords.longitude);
    for (var i = 0; i < $scope.locations.length; i++) { 
        var p1 = new google.maps.LatLng($scope.locations[i].lat, $scope.locations[i].lng);
        $scope.locations[i].distance =  Math.round(getDistance(p1, p2));
        console.log($scope.locations[i].distance);
    }
  };

 
  

})

.controller("loginFBCtrl", function($scope, $rootScope, $firebase, $firebaseSimpleLogin) {
  // Get a reference to the Firebase
  // TODO: Replace "ionic-demo" below with the name of your own Firebase
  var firebaseRef = new Firebase("https://bandung-poi.firebaseio.com/");
  // Create a Firebase Simple Login object
  $scope.auth = $firebaseSimpleLogin(firebaseRef);
  // Initially set no user to be logged in
  $scope.user = null;
  // Logs a user in with inputted provider
  $scope.login = function(provider) {
    $scope.auth.$login(provider);
  };
  // Logs a user out
  $scope.logout = function() {
    $scope.auth.$logout();
  };
  // Upon successful login, set the user object
  $rootScope.$on("$firebaseSimpleLogin:login", function(event, user) {
    $scope.user = user;
  });
  // Upon successful logout, reset the user object
  $rootScope.$on("$firebaseSimpleLogin:logout", function(event) {
    $scope.user = null;
  });
  // Log any login-related errors to the console
  $rootScope.$on("$firebaseSimpleLogin:error", function(event, error) {
    console.log("Error logging user in: ", error);
  });
  
})

.controller('LoginCtrl2', function($scope, LoginService, $ionicPopup, $state) {


    $scope.data = {};
 
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('app.findPOI');

        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }

    $scope.guest = function() {
      $state.go('app.findPOI');
    }

})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService, $stateParams) {
  $scope.data = {};

  $scope.guest = function() {
      $state.go('app.findPOI');
    }
 
  $scope.login = function(data) {
    AuthService.login($scope.data.username, $scope.data.password).then(function(authenticated) {
      $state.go('app.findPOI', {}, {reload: true});

      //$scope.setCurrentUsername($scope.data.username);

    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  };
})
;


