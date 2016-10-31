angular.module('starter')

.controller('AppCtrl', function($scope, $http, $state, $ionicPopup, AuthService, AUTH_EVENTS){
  $scope.username = AuthService.username();
   $scope.leavebalance = AuthService.leavebalance();

  $scope.$on(AUTH_EVENTS.notAuthorized, function(event){
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized',
      template: 'You are not Allowed to Access this resource.'
    });
  });

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event){
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session lost !',
      template: 'Sorry, You have to Log in again.'
    });
  });

  $scope.setCurrentUsername = function(name){

    var dt = $.jStorage.get("dataserve");

    $scope.username = dt.firstname;

  };


   $scope.setLeaveBalance = function(name){

    var at = $.jStorage.get("dataserve");

    $scope.leavebalance = at.leaveBalance;

  };

})

/**.controller('LoginCtrl', ['$scope', '$state', '$ionicPopup', 
  '$AuthService', function($scope, $state, $ionicPopup, AuthService){
      $http.get('js/data.json').success(function(data){
        $scope.bio = biodata; 
      };
  });

])
**/

 .controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService){
    $scope.data = {};

    $scope.login = function(data){
      AuthService.login(data.username, data.password).then(function(authenticated){
        $state.go('main.dash', {}, {reload: true});
        $scope.setCurrentUsername(data.username);
        $scope.setLeaveBalance(data.username);
    }, function(err){
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed !',
        template: 'Please check your credentials !'
      });
    });
  };
})

.controller('DashCtrl', function($scope, $state, $ionicPopup, $http, AuthService){
  $scope.logout = function(){
    AuthService.logout();
    $state.go('login');
  };
  $scope.performValidRequest = function(){
    $http.get('http://localhost:8100/valid').then(
      function(result){
        $scope.response = result;
      });
  };

  $scope.performUnauthorizedRequest = function(){
    $http.get('http://localhost:8100/notauthorized').then(
      function(result){ 
      }, function(err){
        $scope.response = err;
      });
  };

  $scope.performInValidRequest = function(){
    $http.get('http://localhost:8100/notauthenticated').then(
      function(result){
      }, function(err){
        $scope.response = err;
      });
  };
});