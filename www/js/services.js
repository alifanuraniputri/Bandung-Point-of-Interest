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
    var REST_URL = 'http://192.168.1.103:8080/bandung-poi-api/';
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
    };
})

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

;