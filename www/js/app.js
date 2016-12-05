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

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
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


 // remove user route
 .state('main.deleteUser', {
    url:'main/deleteUser',
    views: {
      'admin-tab': {
        templateUrl: 'templates/deleteUser.html',
        controller: 'DeleteUserCtrl'  
      }
    }
  })


// apply for leave route
   .state('main.apply', {
    url:'main/apply',
    views: {
      'dash-tab': {
        templateUrl: 'templates/apply.html',
        controller: 'ApplyLeaveCtrl'
      }
    }
  })


     .state('.successpage', {
    url:'/successpage',
    templateUrl: 'templates/successpage.html',
        controller: 'AppleaveCtrl'
  })




  // view people on leave route

    .state('main.onleave', {
    url:'main/onleave',
    views: {
      'dash-tab': {
        templateUrl: 'templates/onleave.html',
        controller: 'LeaveCtrller'
      }
    }
  })

// create new user route
 .state('main.newuser', {
    url:'main/newuser',
    views: {
      'admin-tab': {
        templateUrl: 'templates/newuser.html',
        controller: 'NewUserCtrl'
      }
    }
  })


 // create new user route
 .state('main.otherusers', {
    url:'main/otherusers',
    views: {
      'admin-tab': {
        templateUrl: 'templates/otherusers.html',
         controller: 'NewUserCtrl'
      }
    }
  })


 // pending on admin view route
 .state('main.pendings', {
    url:'main/pendings',
    views: {
      'admin-tab': {
        templateUrl: 'templates/pendings.html',
        controller:'hrCtrller'
      }
    }
  })




// pending approvals for superuser
  // .state('main.pendingsII', {
  //   url:'main/pendingsII',
  //   views: {
  //     'superuser-tab': {
  //       templateUrl: 'templates/pendingsII.html',
  //       controller:'superuserCtrller'
  //     }
  //   }
  // })


  // pending approvals for superuser
  .state('main.pendingsIII', {
    url:'main/pendingsIII',
    views: {
      'superuser-tab': {
        templateUrl: 'templates/pendingsIII.html',
        controller:'SuperCtrller'
      }
    }
  })



 // pending approvals for G.M.D
  .state('main.pendingsIV', {
    url:'main/pendingsIV',
    views: {
      'gmd-tab': {
        templateUrl: 'templates/pendingsIV.html',
        controller:'GMDCtrller'
      }
    }
  })


 .state('main.userdetails', {
    url:'main/pendings/:aId',
    views: {
      'admin-tab': {
        templateUrl: 'templates/userdetails.html',
        controller:'AppleaveCtrl'

      }
    }
  })

  .state('main.userdetailsII', {
    url:'main/pendingsII/:aId',
    views: {
      'admin-tab': {
        templateUrl: 'templates/userdetailsII.html',
        controller:'DashCtrller'
      }
    }
  })

   .state('main.userdetailsIII', {
    url:'main/pendingsIII/:aId',
    views: {
      'admin-tab': {
        templateUrl: 'templates/userdetailsIII.html',
        controller:'SuperCtrller'
      }
    }
  })

     .state('main.userdetailsIV', {
    url:'main/pendingsIV/:aId',
    views: {
      'admin-tab': {
        templateUrl: 'templates/userdetailsIV.html',
        controller:'GMDCtrller'
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
        controller: 'LeaveCtrller'
      }
    }
  })


  //on leave route for superuser
    .state('main.onleaveIII', {
    url:'main/onleaveIII',
    views: {
      'superuser-tab': {
        templateUrl: 'templates/onleaveIII.html',
        controller: 'LeaveCtrller'
      }
    }
  })


     //on leave route for superuser
    .state('main.onleaveIV', {
    url:'main/onleaveIV',
    views: {
      'gmd-tab': {
        templateUrl: 'templates/onleaveIV.html',
        controller: 'LeaveCtrller'
      }
    }
  })



    .state('main.superuser', {
    url:'main/superuser',
    views: {
      'superuser-tab': {
        templateUrl: 'templates/superuser.html',
        controller:'DashCtrl'   
      }
    },
     data: {
      authorizedRoles: [USER_ROLES.superuser]
    }
  })



 // .state('main.gmd', {
 //    url:'main/gmd',
 //    views: {
 //      'gmd-tab': {
 //        templateUrl: 'templates/gmd.html',
 //        controller:'LeaveCtrller'   
 //      }
 //    },
 //     data: {
 //      authorizedRoles: [USER_ROLES.gmd]
 //    }GMDCtrller
 //  })
   

   .state('main.gmd', {
    url:'main/gmd',
    views: {
      'gmd-tab': {
        templateUrl: 'templates/gmd.html',
        controller:'DashCtrl'   
      }
    },
     data: {
      authorizedRoles: [USER_ROLES.gmd]
    }
  })

   // change password route
   .state('main.password', {
    url:'main/password',
    views: {
      'dash-tab': {
        templateUrl: 'templates/password.html',
        controller: 'ChangePwd'
      }
    }
  })

      // update user leave days route
   .state('main.leavedays', {
    url:'main/leavedays',
    views: {
      'dash-tab': {
        templateUrl: 'templates/leavedays.html',
        controller: 'LeaveBalance'
      }
    }
  })
   

  .state('main.admin', {
    url:'main/admin',
    views: {
      'admin-tab': {
        templateUrl: 'templates/admin.html',
        controller:'DashCtrl'
        
      }
    },
    data: {
      authorizedRoles: [USER_ROLES.admin]
    }
  });


  $urlRouterProvider.otherwise(function ($injector, $location){
    var $state = $injector.get("$state");
     $state.go("login");
  });

})

.run(function($rootScope, $state, AuthService, AUTH_EVENTS){
    $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState){

        if ('data' in next && 'authorizedRoles' in next.data) {
          var authorizedRoles = next.data.authorizedRoles;
          if (!AuthService.isAuthorized(authorizedRoles)) {
           // event.preventDefault();
           
            // $state.go($state.current, {}, {reload: true});
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

