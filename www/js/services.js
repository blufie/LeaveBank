angular.module('starter')

//.service('AuthService', function($scope, $q, $http, USER_ROLES){
  .service('AuthService', function( $q, $http, USER_ROLES){
  var LOCAL_TOKEN_KEY ='yourTokenKey';
  var username ='';
  var leavebalance ='';
  var isAuthenticated = false;
  var role = '';
  var authToken;

  function loadUserCredentials(){
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token){
      useCredentials(token);

    }
  }

  function storeUserCredentials(token){
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token){
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;

    var dt = $.jStorage.get("dataserve");

    if (dt.user_authtype == 'Admin'){
      role = USER_ROLES.admin
    }
    if (dt.user_authtype == 'User') {
      role = USER_ROLES.public
    }

    if (dt.user_authtype == 'SuperUser') {
      role = USER_ROLES.superuser
    }

     if (dt.user_authtype == 'GMD') {
      role = USER_ROLES.gmd
    }



    // Set the token as header for your request !
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }

  function destroyUserCredentials(){
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(name, pw){
    return $q(function(resolve, reject){

      //$http.get('js/data.json').success(function(biodata){

        $http.get('http://localhost:3000/timeoffapi/biodatas').success(function(biodatas){

        var count = 0, ind= 0;
        //console.log("count");
        console.log(biodatas.biodatas[0].user_password);
        console.log(pw);
        

        for (var key in biodatas.biodatas) {
        console.log(biodatas.biodatas[key].user_firstname);
         if ( name == biodatas.biodatas[key].user_email && pw == biodatas.biodatas[key].user_password) {
                   count ++;
      
            $.jStorage.set("dataserve", biodatas.biodatas[key]);
            }
            //   console.log(user_firstname);
            //    console.log(user_authtype);
            // console.log(biodatas);

        }

        console.log(count);

      if (count == 1)
      {

        storeUserCredentials(name + '.yourServerToken');
        resolve('Login Success !');
      }else {
        reject('Login failed !');
      }

    });
  });
};

  var logout = function(){
    destroyUserCredentials();
  };

  var isAuthorized = function(authorizedRoles){
    if(!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return(isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };

  loadUserCredentials();

  return {
    login: login,
    logout:logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function(){return isAuthenticated;},
    username: function(){return username;},
     leavebalance: function(){return leavebalance;},
    role: function(){return role;},
  };

})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS){
  return {
    responseError: function(response){
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

  .config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptor');
});