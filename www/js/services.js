angular.module('starter.services', [])

.factory('ConnService', function($http, $q, $timeout) {
    var connectionEstablished = false;
    
    return {
        processPromise:function(promise) {
            return promise.then(
                function(response) {
                    if (typeof response.data == 'object') {
                        // correct response
                        connectionEstablished = true;
                        return response.data;
                    } 
                    else {
                        // invalid response
                        connectionEstablished = false;
                        return null;
                    }
                }, 
                function (response) {
                    // promise cannot be fulfilled
                    connectionEstablished = false;
                    return null;
                }
            );
        },
        
        isConnectionEstablished:function() {
            return connectionEstablished;
        }
    };
})

.factory('RestService', function($http,$q, ConnService, $rootScope) {
    var REST_URL = 'http://192.168.43.116:8080/bandung-poi-api/';
    //var REST_URL = 'http://localhost:8080/bandung-poi-api/';
    var URL = {
               'LOCATION_LIST' : REST_URL + 'location/list',
               'LOCATION_GET' : REST_URL + 'location/',
               'LOCATION_RANK_GET' : REST_URL + 'location/rank/',
               'PARK_LIST' : REST_URL + 'location/listByCategory?categoryId=300',
               'HOSPITAL_LIST' : REST_URL + 'location/listByCategory?categoryId=3',
               'MOSQUE_LIST' : REST_URL + 'location/listByCategory?categoryId=2',
               'POPULARITY_LIST' : REST_URL + 'location/popular',
               'BEST_RATED_LIST' : REST_URL + 'location/bestRated',
               'ISSUE_LIST' : REST_URL + 'location/issue',
               'LOGIN' : REST_URL + 'user/validate',
               'CHECKIN' : REST_URL + 'checkin/add',
               'RATING' : REST_URL + 'rating/add',
            };
    return {
        locationList : function() {
            return ConnService.processPromise($http.get(URL['LOCATION_LIST']));
        },
        locationGet : function(id) {
            return ConnService.processPromise($http.get(URL['LOCATION_GET'] + id));
        },
        locationRankGet : function(id) {
            return ConnService.processPromise($http.get(URL['LOCATION_RANK_GET'] + id));
        },
        parkList : function() {
            return ConnService.processPromise($http.get(URL['PARK_LIST']));
        },
        hospitalList : function() {
            return ConnService.processPromise($http.get(URL['HOSPITAL_LIST']));
        },
        mosqueList : function() {
            return ConnService.processPromise($http.get(URL['MOSQUE_LIST']));
        },
        popularityList : function(park,hospital,mosque) {
            return ConnService.processPromise($http.get(URL['POPULARITY_LIST']+'?park='+park+'&hospital='+hospital+'&mosque='+mosque));
        },
        bestRatedList : function(park,hospital,mosque) {
            return ConnService.processPromise($http.get(URL['BEST_RATED_LIST']+'?park='+park+'&hospital='+hospital+'&mosque='+mosque));
        },
        issueList : function() {
            return ConnService.processPromise($http.get(URL['ISSUE_LIST']));
        },
        login : function(nm,pw) {
            return ConnService.processPromise($http.post(URL['LOGIN']+'?username='+nm+'&psswd='+pw));
        },
        checkin : function(usr,loc) {
            return ConnService.processPromise($http.post(URL['CHECKIN']+'?userId='+usr+'&locationId='+loc));
        },
        rating : function(usr,loc,c1,c2,c3,c4,c5,ov) {
            return ConnService.processPromise($http.post(URL['RATING']+'?userId='+usr+'&locationId='+loc+'&criteria1='+c1
              +'&criteria2='+c2+'&criteria3='+c3+'&criteria4='+c4+'&criteria5='+c5+'&overall='+ov));
        },
    };
})

.service('AuthService', function($q, $http, USER_ROLES, RestService) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = 'Guest';
  var isAuthenticated = false;
  var role = USER_ROLES.guest;
  var authToken;
  var name = 'Guest';
  var id = undefined;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token,uname,uid) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token,uname,uid);
  }
 
  function useCredentials(token,uname,uid) {
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;
    name = uname;
    id = uid;
    role = USER_ROLES.registered
    
 
    // Set the token as header for your requests!
    //$http.defaults.headers.common['X-Auth-Token'] = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = 'Guest';
    isAuthenticated = false;
    name = 'Guest';
    id = undefined;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var login = function(name, pw) {
    return $q(function(resolve, reject) {
        RestService.login(name,pw).then( function (data) {
            if (data.code==1) {
                storeUserCredentials(name + '.'+data.id,data.name,data.id);
                resolve('Login success.');
            } else {
                reject('Login Failed.');
            }
         })
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    name: function() {return name;},
    id: function() {return id;},
    role: function() {return role;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

;