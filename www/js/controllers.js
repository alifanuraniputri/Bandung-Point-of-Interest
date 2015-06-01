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

.controller('FindPOICtrl', function($scope, $timeout, uiGmapGoogleMapApi) {
   $scope.map = { center: { latitude: -6.898438, longitude: 107.60779}, zoom: 13, bounds: {} };


  $scope.circles = [
    {
      id: 1,
      center: {
          latitude: -6.898438,
          longitude: 107.60779
      },
      radius: 3000,
      stroke: {
          color: '#07D5DC',
          weight: 1,
          opacity: 1
      },
      fill: {
          color: '#07D5DC',
          opacity: 0.2
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

 

  uiGmapGoogleMapApi.then(function(maps) {
    $timeout(function() {
      console.log('loaded');
      $ionicLoading.hide();  
    }, 2000);
  });

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


