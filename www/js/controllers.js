angular.module('starter.controllers', ['uiGmapgoogle-maps', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
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

.controller("RateCtrl", function($state, $scope, $ionicPopup) {
  $scope.ratingAll = 0.1;
  $scope.rating1 = 0.1;
  $scope.rating2 = 0.1;
  $scope.rating3 = 0.1;
  $scope.rating4 = 0.1;
  $scope.rating5 = 0.1;
  $scope.rateFunction = function() {
    var alertPopup = $ionicPopup.alert({
                title: 'Rating Submitted!',
            });
    alertPopup.then(function(res) {
      $state.go('app.history');
     });
  };

})

.controller("LocationCtrl", function($state, $scope, $ionicPopup) {
  $scope.rating1 = 3;
  $scope.rating2 = 43;
  $scope.rating3 = 4;
  $scope.rating4 = 4;
  $scope.rating5 = 5;
  $scope.isReadonly = true;
})

.controller('FindPOICtrl', function($scope, $timeout, uiGmapGoogleMapApi, $state, $cordovaGeolocation, RestService, ConnService) {

    $scope.parks = [];
    $scope.parkMarkers = [];
    $scope.hospitals = [];
    $scope.hospitalMarkers = [];
    $scope.mosques = [];
    $scope.mosqueMarkers = [];
    $scope.circles;
    $scope.mylat;
    $scope.mylng;
    var pmarkersbound = [];
    var hmarkersbound = [];
    var mmarkersbound = [];

    $scope.mylocation = {
      id: 0,
      coords: {
        latitude: -6.924783191,
        longitude: 107.6091358
      },
      options: { draggable: false,
        labelContent: "My Location",
            labelAnchor: "20 0",
            labelClass: "marker-labels",
           icon: {url: "./img/marker.png" ,scaledSize: new google.maps.Size(35, 54)},},
    };

    $cordovaGeolocation
    .getCurrentPosition()
    .then(function (position) {
        //var lat  = position.coords.latitude;
        //var lng = position.coords.longitude;
        $scope.mylat  = -6.922783191;
        $scope.mylng = 107.6081358;
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

                //$scope.find();
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

        console.log("scope find");

        var p2 = new google.maps.LatLng($scope.circle.center.latitude, $scope.circle.center.longitude);

        for (var i = 0; i < $scope.parks.length; i++) { 
            var p1 = new google.maps.LatLng($scope.parks[i].lat, $scope.parks[i].lng);
            if (getDistance(p1, p2)<$scope.circle.radius) {

                pmarkersbound.push(createMarker(i, $scope.parks, "./img/park.png" ));
            }
        }
        $scope.parkMarkers = pmarkersbound; 

        for (var i = 0; i < $scope.hospitals.length; i++) { 
            var p1 = new google.maps.LatLng($scope.hospitals[i].lat, $scope.hospitals[i].lng);
            if (getDistance(p1, p2)<$scope.circle.radius) {
                hmarkersbound.push(createMarker(i, $scope.hospitals, "./img/hospital.png" ));
            }
        }
        $scope.hospitalMarkers = hmarkersbound; 

        for (var i = 0; i < $scope.mosques.length; i++) { 
            var p1 = new google.maps.LatLng($scope.mosques[i].lat, $scope.mosques[i].lng);
            if (getDistance(p1, p2)<$scope.circle.radius) {
                mmarkersbound.push(createMarker(i, $scope.mosques, "./img/mosque.png" ));
            }
        }
        $scope.mosqueMarkers = mmarkersbound; 

    };
   
    $scope.loadParks();
    $scope.loadHospitals();
    $scope.loadMosques();

})


.controller('CheckinCtrl', function($scope, $timeout, uiGmapGoogleMapApi, $state, $cordovaGeolocation) {
  
  $scope.map = { center: { latitude: -6.924783191, longitude: 107.6091358}, zoom: 15, bounds: {} };

  $scope.marker = {
      id: 0,
      coords: {
        latitude: -6.921783191,
        longitude: 107.6071358
      },
      options: { draggable: false,
        labelContent: "Alun Alun",
            labelAnchor: "20 0",
            labelClass: "marker-labels",
            icon: {url: "./img/marker.png" },},
      events: {
        click: function () {
          $state.go('app.location',{locationId:3});
        }
      },
    };

    $scope.mylocation = {
      id: 0,
      coords: {
        latitude: -6.924783191,
        longitude: 107.6091358
      },
      options: { draggable: false,
        labelContent: "My Location",
            labelAnchor: "20 0",
            labelClass: "marker-labels",
           icon: {url: "./img/mylocation.png" },},
    };

    $cordovaGeolocation
    .getCurrentPosition()
    .then(function (position) {
      var lat  = position.coords.latitude;
      var lng = position.coords.longitude;
      $scope.map = {center: {latitude: lat, longitude: lng }, zoom: 15 };
      $scope.mylocation.coords.latitude = lat;
      $scope.mylocation.coords.longitude = lng;
    }, function(err) {
      // error
      alert('Error fetching position');
    });

})


.controller('PlaylistCtrl', function($scope, $stateParams) {
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

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {


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
;


