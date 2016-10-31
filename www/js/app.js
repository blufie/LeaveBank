// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// angular.module('starter', ['ionic', 'ngMockE2E'])
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES){
  $stateProvider
  .state('login', {
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'LoginCtrl'
  })
  .state('main', {
    url:'/',
    abstract:true,
    templateUrl:'templates/main.html'
  })
  .state('main.dash', {
    url:'main/dash',
    views: {
      'dash-tab': {
        templateUrl: 'templates/dashboard.html',
        controller:'DashCtrl'
      }
    }
  })


// report route
 .state('main.reports', {
    url:'main/reports',
    views: {
      'admin-tab': {
        templateUrl: 'templates/reports.html',
        
      }
    }
  })


// apply for leave route
   .state('main.apply', {
    url:'main/apply',
    views: {
      'dash-tab': {
        templateUrl: 'templates/apply.html',
      }
    }
  })


  // view people on leave route

    .state('main.onleave', {
    url:'main/onleave',
    views: {
      'dash-tab': {
        templateUrl: 'templates/onleave.html',
      }
    }
  })

// create new user route
 .state('main.newuser', {
    url:'main/newuser',
    views: {
      'admin-tab': {
        templateUrl: 'templates/newuser.html',
      }
    }
  })


 // pending on admin view route
 .state('main.pendings', {
    url:'main/pendings',
    views: {
      'admin-tab': {
        templateUrl: 'templates/pendings.html',
      }
    }
  })

  // .state('main.public', {
  //   url:'main/public',
  //   views: {
  //     'public-tab': {
  //       templateUrl: 'templates/public.html'
       
  //     }
  //   }
  // })

// people onleave on admin view route
 .state('main.onleaveII', {
    url:'main/onleaveII',
    views: {
      'admin-tab': {
        templateUrl: 'templates/onleaveII.html',
      }
    }
  })

    .state('main.superuser', {
    url:'main/superuser',
    views: {
      'superuser-tab': {
        templateUrl: 'templates/superuser.html'
       
      },
    },
     data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  })

   

  .state('main.admin', {
    url:'main/admin',
    views: {
      'admin-tab': {
        templateUrl: 'templates/admin.html'
        
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  });


  $urlRouterProvider.otherwise(function ($injector, $location){
    var $state = $injector.get("$state");
    $state.go("main.dash");
  });

})

.run(function($rootScope, $state, AuthService, AUTH_EVENTS){
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState){

        if ('data' in next && 'authorizedRoles' in next.data) {
          var authorizedRoles = next.data.authorizedRoles;
          if (!AuthService.isAuthorized(authorizedRoles)) {
           // event.preventDefault();
            $state.go($state.current, {}, {reload: true});
            $rootScope.$broadcast(AUTH_EVENTS.notauthorized);
          }
        }

        if (!AuthService.isAuthenticated()){
          if (next.name !== 'login') {
            event.preventDefault();
            $state.go('login');
          }
        }
    });
})

