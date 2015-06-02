angular.module('starter.controllers', ['uiGmapgoogle-maps'])

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

.controller('FindPOICtrl', function($scope, $timeout, uiGmapGoogleMapApi, $state) {

  $scope.find = function() {
    $scope.marker.options.visible=true;
    
  };
  
  $scope.map = { center: { latitude: -6.921783191, longitude: 107.6071358}, zoom: 14, bounds: {} };

  //$scope.markers = { };

  $scope.marker = {
      id: 0,
      coords: {
        latitude: -6.921783191,
        longitude: 107.6071358
      },
      options: { draggable: false,
        visible:false,
        labelContent: "Alun Alun",
            labelAnchor: "20 0",
            labelClass: "marker-labels"},
      events: {
        click: function () {
          $state.go('app.location',{locationId:3});
        }
      },
    };

  $scope.circles = [
    {
      id: 1,
      center: {
          latitude: -6.921783191,
          longitude: 107.6071358
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
      draggable: true, // optional: defaults to false
      clickable: true, // optional: defaults to true
      editable: true, // optional: defaults to false
      visible: true, // optional: defaults to true
      control: {}
    }
  ];

  var createRandomMarker = function(i, bounds, idKey) {
    var lat_min = bounds.southwest.latitude,
      lat_range = bounds.northeast.latitude - lat_min,
      lng_min = bounds.southwest.longitude,
      lng_range = bounds.northeast.longitude - lng_min;

    if (idKey == null) {
      idKey = "id";
    }

    var latitude = lat_min + (Math.random() * lat_range);
    var longitude = lng_min + (Math.random() * lng_range);
    var ret = {
      latitude: latitude,
      longitude: longitude,
      title: 'm' + i
    };
    ret[idKey] = i;
    return ret;
  };

  $scope.randomMarkers = [];
  // Get the bounds from the map once it's loaded
  $scope.$watch(function() {
    return $scope.map.bounds;
  }, function(nv, ov) {
    // Only need to regenerate once
    if (!ov.southwest && nv.southwest) {
      var markers = [];
      for (var i = 0; i < 3; i++) {
        markers.push(createRandomMarker(i, $scope.map.bounds))
      }
      $scope.randomMarkers = markers;
      
    }
  }, true);

})


.controller('CheckinCtrl', function($scope, $timeout, uiGmapGoogleMapApi, $state) {
  
  $scope.map = { center: { latitude: -6.924783191, longitude: 107.6091358}, zoom: 14, bounds: {} };

  $scope.marker = {
      id: 0,
      coords: {
        latitude: -6.921783191,
        longitude: 107.6071358
      },
      options: { draggable: false,
        labelContent: "Alun Alun",
            labelAnchor: "20 0",
            labelClass: "marker-labels"},
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
            labelClass: "marker-labels"},
    };

})


.controller('PlaylistCtrl', function($scope, $stateParams) {
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


