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

    $scope.username = dt.user_lastname;

  };


   $scope.setLeaveBalance = function(name){

    var at = $.jStorage.get("dataserve");

    $scope.leavebalance = at.user_leave_balance;

  };

})


 .controller('LoginCtrl',  function($scope, $state, $ionicPopup, AuthService){
    $scope.data = {};

    $scope.login = function(data){
      AuthService.login(data.username, data.password).then(function(authenticated){
        // if (data.user_authtype) {}
        console.log(AuthService.role());
        console.log(data.username);
        console.log(data.password);
        
    if (AuthService.role() === "public") {
        $state.go('main.dash', {}, {reload: true});
      }
      else if (AuthService.role() === "admin_role") {
        $state.go('main.admin', {}, {reload: true});
      }  
      else if (AuthService.role() === "gmd_role") {
        $state.go('main.gmd', {}, {reload: true});
      }
      // else if (AuthService.role() === "superuser_role") 
       else {
        $state.go('main.superuser', {}, {reload: true});
      }


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

  .controller('DashCtrller',['$scope', '$http', '$state', function($scope, $http, $state,$ionicPopup){
    $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
        $scope.application = data.application;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        console.log($scope.whichapplication);
        console.log($scope.data);

        $scope.onItemDelete = function(item) {
          $scope.application.splice($scope.application.indexOf(item), 1);
        }

        $scope.doRefresh = function(){
          $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
            $scope.application = data.application;
            $scope.$broadcast('scroll.refreshComplete');
          });
        }

        $scope.toggleStar = function(item){
            item.star = !item.star;
        }

        $scope.moveItem = function(item, fromIndex, toIndex){
          $scope.application.splice(fromIndex, 1);
          $scope.application.splice(toIndex, 0, item);
        };
  });
}])





 // Apply for leave Controller 
.controller('AppleaveCtrl', function($scope, $http,$location,$state,$ionicPopup,$window){

$scope.dateShow = function(){
                  var dt = $.jStorage.get("dataserve");
                  console.log(dt.user_leave_balance);
                          var LeaveBal = dt.user_leave_balance;
                          var max = LeaveBal;

                    min = 1;
                    select = document.getElementById('LeaveDays');

                    for (var i = min; i<=max; i++){
                       var opt = document.createElement('option');
                       opt.value = i;
                       opt.innerHTML = i;
                       select.appendChild(opt);
                    }
      };   


    $scope.applyModel = {};

    $scope.onSubmit = function(valid) {

      if (valid)
       {
        var dt = $.jStorage.get("dataserve");
        $scope.applyModel.uId = dt.user_id;
          // console.log(dt.user_id);
          // console.log(dt.user_firstname);
          console.log($scope.applyModel.uId);

             var ds = $.jStorage.get("dataserve");
        $scope.applyModel.Uname = ds.user_firstname + " "+ ds.user_lastname;

         var dp = $.jStorage.get("dataserve");
        $scope.applyModel.leavebalance = dp.user_leave_balance;


         var dt = $.jStorage.get("dataserve");
        $scope.applyModel.useremail = dt.user_email;


      $http.post('http://localhost:3000/timeoffapi/application',$scope.applyModel)
        .success(function(data){
            console.log(":)");
            $scope.applyModel.uId = dt.user_id;
             console.log($scope.applyModel);
  $state.go("main.pendings");
   window.location.reload('/admin');
            // $location.path('/dash');
            // $state.go('/dash');
        }).error(function(data){
            console.log(":(")
        });

      } else {
          console.log("Invalid Form!");
      }

    };


    $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
        $scope.application = data.application;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        // console.log($scope.item.relName);
        // console.log(relName);
        var dt = $.jStorage.get("dataserve");
        console.log(dt.user_firstname);

         var ds = $.jStorage.get("dataserve");

        $scope.doRefresh = function(){
          $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
            $scope.application = data.application;
            $scope.$broadcast('scroll.refreshComplete');
          });
        }
  });


    $scope.Accept = function() {
// $scope.item = {};
console.log($("#status").text());
console.log($("#email").text());

var stat = $("#status").text();
var email = $("#email").text();
          

      $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'2'})
        .success(function(data){
            console.log(":)");
            window.location.href='http://localhost:8100/#/main/pendings';
            window.location.reload(true);
        });

      

    };


    $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Leave Application Submitted!',
     template: 'Expect a Reply from us ASAP!'
   });
 
   alertPopup.then(function(res) {
     $state.go('main.dash');
   });
 };

           $scope.SendRes = function() {
            console.log($("#email").text());
            var email = $("#email").text();
            var useremail = $("#useremail").text();

        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Feedback for your App", // Subject
            "Your Leave has been declined by the H.R.",                      // Body
            // ["test@example.com"],    // To
            [useremail],                    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
        else{
           console.log("Sad Face");
        }


 var email = $("#email").text();
    console.log($("#useremail").text());
        $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'5'})
        .success(function(data){
            console.log(":)");

            // $state.go('main.pendings');
            window.location.href='http://localhost:8100/#/main/pendingsIV';
            // window.location.reload(true);
            window.location.reload('/gmd');
        }).error(function(data){
            console.log(":(")
        });
       
    };

     $('#startDate').datetimepicker({
            format: 'Y-m-d',
            minDate: new Date(),
            timepicker: false,
            weekend: false,
            onSelectDate: function (dp, $input)
            {
                $scope.applyModel.startDate = moment(dp).format('YYYY-MM-DD');
                console.log($scope.applyModel.startDate); 
            }
        });

       $('#endDate').datetimepicker({
            format: 'Y-m-d',
            minDate: new Date(),
            timepicker: false,
            weekend: false,
            onSelectDate: function (dp, $input)
            {

                $scope.applyModel.endDate = moment(dp).format('YYYY-MM-DD');
            }
        });
})




// Apply for leave Controller 
.controller('ApplyLeaveCtrl', function($scope, $http,$location,$state,$ionicPopup,$window){

$scope.dateShow = function(){
                  var dt = $.jStorage.get("dataserve");
                  console.log(dt.user_leave_balance);
                          var LeaveBal = dt.user_leave_balance;
                          var max = LeaveBal;

                    min = 1;
                    select = document.getElementById('LeaveDays');

                    for (var i = min; i<=max; i++){
                       var opt = document.createElement('option');
                       opt.value = i;
                       opt.innerHTML = i;
                       select.appendChild(opt);
                    }
      };   


    $scope.applyModel = {};

    $scope.onSubmit = function(valid) {

      if (valid)
       {
        var dt = $.jStorage.get("dataserve");
        $scope.applyModel.uId = dt.user_id;
          // console.log(dt.user_id);
          // console.log(dt.user_firstname);
          console.log($scope.applyModel.uId);

             var ds = $.jStorage.get("dataserve");
        $scope.applyModel.Uname = ds.user_firstname + " "+ ds.user_lastname;

         var dp = $.jStorage.get("dataserve");
        $scope.applyModel.leavebalance = dp.user_leave_balance;


         var dt = $.jStorage.get("dataserve");
        $scope.applyModel.useremail = dt.user_email;


      $http.post('http://localhost:3000/timeoffapi/application',$scope.applyModel)
        .success(function(data){
            console.log(":)");
            $scope.applyModel.uId = dt.user_id;
             console.log($scope.applyModel);

            // $location.path('/dash');
            // $state.go('/dash');
        }).error(function(data){
            console.log(":(")
        });

      } else {
          console.log("Invalid Form!");
      }

    };


    $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
        $scope.application = data.application;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        // console.log($scope.item.relName);
        // console.log(relName);
        var dt = $.jStorage.get("dataserve");
        console.log(dt.user_firstname);

         var ds = $.jStorage.get("dataserve");

        $scope.doRefresh = function(){
          $http.get('http://localhost:3000/timeoffapi/application').success(function(data){
            $scope.application = data.application;
            $scope.$broadcast('scroll.refreshComplete');
          });
        }
  });




    $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Leave Application Submitted!',
     template: 'Expect a Reply from us ASAP!'
   });
 
   alertPopup.then(function(res) {
     $state.go('main.dash');
   });
 };

           $scope.SendRes = function() {
            console.log($("#email").text());
            var email = $("#email").text();
            var useremail = $("#useremail").text();

        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Feedback for your App", // Subject
            "Your Leave has been declined by the H.R.",                      // Body
            // ["test@example.com"],    // To
            [useremail],                    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
        else{
           console.log("Sad Face");
        }


 var email = $("#email").text();
    console.log($("#useremail").text());
        $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'5'})
        .success(function(data){
            console.log(":)");

            // $state.go('main.pendings');
            window.location.href='http://localhost:8100/#/main/pendingsIV';
            // window.location.reload(true);
            window.location.reload('/gmd');
        }).error(function(data){
            console.log(":(")
        });
       
    };

     $('#startDate').datetimepicker({
            format: 'Y-m-d',
            minDate: new Date(),
            timepicker: false,
            weekend: false,
            onSelectDate: function (dp, $input)
            {
                $scope.applyModel.startDate = moment(dp).format('YYYY-MM-DD');
                console.log($scope.applyModel.startDate); 
            }
        });

       $('#endDate').datetimepicker({
            format: 'Y-m-d',
            minDate: new Date(),
            timepicker: false,
            weekend: false,
            onSelectDate: function (dp, $input)
            {

                $scope.applyModel.endDate = moment(dp).format('YYYY-MM-DD');
            }
        });
})



// .controller('superuserCtrller',['$scope', '$http', '$state', function($scope, $http, $state,$location, AuthService){
//     $http.get('http://localhost:3000/timeoffapi/application/0').success(function(data){
//       console.log(data);

//        $scope.logout = function(){
//     AuthService.logout();
//     $state.go('login');
//   };

//         $scope.application = data.users;
//         $scope.whichapplication =$state.params.aId;
//         $scope.data = { showDelete: false,showReorder: false };

//         console.log(data.users);
//   });

//      $scope.Accept = function() {

// var stat = $("#status").text();
// var email = $("#email").text();
// // var useremail = $("#useremail").text();
// var userEmail = $("#useremail").text();

//       $http.put('http://localhost:3000/timeoffapi/application', {useremail:userEmail,status: '1'})

//         .success(function(data){
//           console.log($("#useremail").text());
//             console.log(":)");
//             window.location.href='http://localhost:8100/#/main/pendingsIII';
//             // window.location.reload(true);
//             window.location.reload('/superuser');
//         }).error(function(data){
//             console.log(":(")
//         });

//     };

//  //      $scope.SendRes = function() {
//  //            console.log($("#email").text());
//  //            var email = $("#email").text();
//  //            var useremail = $("#useremail").text();

//  //        if(window.plugins && window.plugins.emailComposer) {
//  //            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
//  //                console.log("Response -> " + result);
//  //            }, 
//  //            "Feedback for your App", // Subject
//  //            "Your Application has been declined by your H.O.D.",                      // Body
//  //            // ["test@example.com"],    // To
//  //            [useremail],                    // To
//  //            null,                    // CC
//  //            null,                    // BCC
//  //            false,                   // isHTML
//  //            null,                    // Attachments
//  //            null);                   // Attachment Data
//  //        }
//  //        else{
//  //           console.log("Sad Face");
//  //        }


//  // var email = $("#email").text();
//  //    console.log($("#useremail").text());
//  //        $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'4'})
//  //        .success(function(data){
//  //            console.log(":)");
//  //            window.location.href='http://localhost:8100/#/main/pendingsIV';
//  //            // window.location.reload(true);
//  //            window.location.reload('/gmd');
//  //        }).error(function(data){
//  //            console.log(":(")
//  //        });
       
//  //    };


        

// }])


.controller('hrCtrller',['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('http://localhost:3000/timeoffapi/application/1').success(function(data){
      console.log(data);
        $scope.application = data.users;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        console.log(data.users);
  });

    

}])


//Staff to be approved by G.M.D.

 .controller('GMDCtrller',['$scope', '$http', '$state', function($scope, $http, $state,$location, AuthService){
    $http.get('http://localhost:3000/timeoffapi/application/2').success(function(data){

          $scope.logout = function(){
    AuthService.logout();
    $state.go('login');
  };
$scope.loader = true;

     
      console.log(data);
        $scope.application = data.users;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        console.log(data.users);
        var dt = $.jStorage.get("dataserve");

    $scope.leavebalance = dt.user_leave_balance;

    var leave = $scope.leavebalance;

console.log($scope.leavebalance);
console.log($("#days").text());
console.log($("#email").text());
console.log($("#status").text());

var stats = $("#days").text();
console.log(stats);
var parse = parseInt(stats);
console.log(parse);
var x = leave - parse;
console.log(x);

  });

     $scope.FinalAccept = function() {
// $scope.item = {};
console.log($("#status").text());
console.log($("#email").text());
console.log($("#days").text());
console.log($("#userEmail").text());

var dt = $.jStorage.get("dataserve");

    $scope.leavebalance = dt.user_leave_balance;

    var leave = $scope.leavebalance;

var stat = $("#status").text();
var email = $("#email").text();
var stats = $("#days").text();
var userEmail = $("#useremail").text();
var leavebalance = $("#leavedays").text();

var parse = parseInt(stats);
var leaveparse = parseInt(leavebalance);

console.log(parse);
console.log(leave);
console.log(leaveparse);
var x = leaveparse - parse;
console.log(x);


    $http.put('http://localhost:3000/timeoffapi/biodatas', {email:userEmail,leave_balance: x})
        .success(function(data){
            console.log(":)");
            // window.location.href='http://localhost:8100/#/main/pendingsIV';
            // window.location.reload(true);
            // window.location.reload('/gmd');
        }).error(function(data){
            console.log(":(")
        });


      $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'3'})
        .success(function(data){
            console.log(":)");
            // window.location.href='http://localhost:8100/#/main/pendingsIV';
            // window.location.reload(true);
            // window.location.reload('/gmd');


              $state.go("main.pendingsIV");
            window.location.reload('/gmd');
        }).error(function(data){
            console.log(":(")
        });   


        var useremail = $("#useremail").text();
            var email = $("#email").text();

        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Feedback for your Application", // Subject
            "Your Application has been approved!. Your Reliever was also sent this mail.",                      // Body
            // ["test@example.com"],    // To
            [useremail],                    // To
            [email],                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
        else{
           console.log("Sad Face");
        }   

    };

         $scope.SendRejEmail = function() {
            console.log($("#email").text());
            console.log($("#useremail").text());
            var useremail = $("#useremail").text();
            var email = $("#email").text();


        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Feedback for your Application", // Subject
            "Your Application has been declined by the G.M.D",                      // Body
            // ["test@example.com"],    // To
            [useremail],                    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
        else{
           console.log("Sad Face");
        }


 var email = $("#email").text();
    console.log($("#useremail").text());
        $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'6'})
        .success(function(data){
            console.log(":)");
            window.location.href='http://localhost:8100/#/main/pendingsIV';
            // window.location.reload(true);
            window.location.reload('/gmd');
        }).error(function(data){
            console.log(":(")
        });   
       
    };
}])


//Controller for H.O.Ds
.controller('SuperCtrller',['$scope', '$http', '$state', function($scope, $http, $state,$location, AuthService){
    $http.get('http://localhost:3000/timeoffapi/application/0').success(function(data){

          $scope.logout = function(){
    AuthService.logout();
    $state.go('login');
  };
$scope.loader = true;

     
      console.log(data);
        $scope.application = data.users;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        console.log(data.users);
        var dt = $.jStorage.get("dataserve");

    $scope.leavebalance = dt.user_leave_balance;

    var leave = $scope.leavebalance;

console.log($scope.leavebalance);
console.log($("#days").text());
console.log($("#email").text());
console.log($("#status").text());

var stats = $("#days").text();
console.log(stats);
var parse = parseInt(stats);
console.log(parse);
var x = leave - parse;
console.log(x);

  });

     $scope.Accept = function() {
// $scope.item = {};
console.log($("#status").text());
console.log($("#email").text());
console.log($("#days").text());
console.log($("#userEmail").text());

var dt = $.jStorage.get("dataserve");

    $scope.leavebalance = dt.user_leave_balance;

    var leave = $scope.leavebalance;

var stat = $("#status").text();
var email = $("#email").text();
var stats = $("#days").text();
var userEmail = $("#useremail").text();
var leavebalance = $("#leavedays").text();

var parse = parseInt(stats);
var leaveparse = parseInt(leavebalance);

console.log(parse);
console.log(leave);
console.log(leaveparse);
var x = leaveparse - parse;
console.log(x);


      $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'1'})
        .success(function(data){
            console.log(":)");
            //window.location.href='http://localhost:8100/#/main/pendingsIII';
            $state.go("main.pendingsIII");
            // window.location.reload(true);
            window.location.reload('/superuser');
        });   


        var useremail = $("#useremail").text();
            var email = $("#email").text();

        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Feedback for your Application", // Subject
            "Your Application has been approved!. Your Reliever was also sent this mail.",                      // Body
            // ["test@example.com"],    // To
            [useremail],                    // To
            [email],                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
        else{
           console.log("Sad Face");
        }   

    };

         $scope.SendRejEmail = function() {
            console.log($("#email").text());
            console.log($("#useremail").text());
            var useremail = $("#useremail").text();
            var email = $("#email").text();


        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Feedback for your Application", // Subject
            "Your Application has been declined by the G.M.D",                      // Body
            // ["test@example.com"],    // To
            [useremail],                    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
        else{
           console.log("Sad Face");
        }


 var email = $("#email").text();
    console.log($("#useremail").text());
        $http.put('http://localhost:3000/timeoffapi/application', {relEmail:email,status:'6'})
        .success(function(data){
            console.log(":)");
            window.location.href='http://localhost:8100/#/main/pendingsIV';
            // window.location.reload(true);
            window.location.reload('/gmd');
        }).error(function(data){
            console.log(":(")
        });   
       
    };
}])



 //Staff on Leave Controller

 .controller('LeaveCtrller',['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('http://localhost:3000/timeoffapi/application/3').success(function(data){
      console.log(data);
        $scope.application = data.users;
        $scope.whichapplication =$state.params.aId;
        $scope.data = { showDelete: false,showReorder: false };

        console.log(data.users);
  });
}])


// Create New User
.controller('NewUserCtrl', function($scope, $http, $location, $ionicPopup){

      $scope.value = 15;
      $scope.min = 1;
      $scope.max = 30;


    $scope.userModel = {};

    $scope.onSubmit = function(valid) {

      if (valid) {
          console.log("New User Created!");
          console.log($scope.userModel);


      $http.post('http://localhost:3000/timeoffapi/biodatas', $scope.userModel)
        .success(function(data){
            console.log(":)") ;
            // $location.path('/admin');
            // window.location.href='http://localhost:8100/#/main/admin';
            // window.location.reload(true);
            // window.location.reload('/admin');
            $state.go("main.admin");
            window.location.reload('/admin');
        }).error(function(data){
            console.log(":(")
        });

      } else {
          console.log("Invalid User!");
      }
    };

    $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'New User Created!',
     template: 'The user can now login with his/her credentials.'
   });
 
   alertPopup.then(function(res) {
     console.log('Thank you for advice.');
   });
 };
})




.controller('DeleteUserCtrl', function($scope, $http, $location, $ionicPopup){ 
  $scope.DeleteData = function (user_email) {
      var data = user_email;

                console.log(user_email);

            var url = 'http://localhost:3000/timeoffapi/biodatas/' + data;

            $http.delete('http://localhost:3000/timeoffapi/biodatas/' + data)
            .success(function (data) {
                // $scope.ServerResponse = data;
                 console.log(url);
                console.log(user_email);
            })
            .error(function (data) {
                $scope.ServerResponse = htmlDecode("Data: " + data);
                console.log($scope.ServerResponse);
                  });
        };
           $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: ' User Deleted!',
     template: 'The user can no longer login with his/her credentials.'
   });
 
   alertPopup.then(function(res) {

   });
 };
})







 //Change user password Controller

 .controller('ChangePwd',['$scope', '$http', '$state', function($scope, $http, $state){

  $scope.Update = function(user_password) {

var dt = $.jStorage.get("dataserve");

    $scope.userEmail = dt.user_email;

    var usrEmail = $scope.userEmail;


// var stat = $("#status").text();
// var email = $("#email").text();
// var stats = $("#days").text();
// var userEmail = $("#userEmail").text();
// var leavebalance = $("#leavedays").text();
      // var sha1 = require('sha1');
 
      //     sha1("message");


console.log(usrEmail);
console.log($scope.userEmail); 


 var data = user_password;
console.log(user_password);
console.log(data);

// var password = $("#user_password").text();
// var password1 = $("#user_password1").text();

// console.log($("#user_password").text());

// console.log(password);
// console.log(password1);


    $http.put('http://localhost:3000/timeoffapi/biodatas/email', {email:usrEmail,password: data})
        .success(function(data){
            console.log(":)");
            window.location.href='http://localhost:8100/#/main/dash';
            window.location.reload(true);
            window.location.reload('/admin');
        }).error(function(data){
            console.log(":(")
        });     

    };

//     function validatePassword(){
// var pass2=document.getElementById("user_password1").value;
// var pass1=document.getElementById("user_password").value;
// if(pass1!=pass2)
//   document.getElementById("user_password").setCustomValidity("Passwords Don't Match");
// else
//   document.getElementById("user_password1").setCustomValidity('');  
// //empty string means no validation error
// }
}])



// .controller('EmailController', function($scope) {
//     $scope.sendFeedback= function() {
//         if(window.plugins && window.plugins.emailComposer) {
//             window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
//                 console.log("Response -> " + result);
//             }, 
//             "Feedback for your App", // Subject
//             "",                      // Body
//             ["test@example.com"],    // To
//             null,                    // CC
//             null,                    // BCC
//             false,                   // isHTML
//             null,                    // Attachments
//             null);                   // Attachment Data
//         }
//     }
// })



 //Update Leave Balance Controller
 .controller('LeaveBalance',['$scope', '$http', '$state', function($scope, $http, $state){
 
$scope.leaveModel={};


    $scope.show = function() {
    console.log($scope.leaveModel);
  console.log($scope.leaveModel.user_name);
  console.log($scope.leaveModel.user_leaveBalance);
  var useremail = $scope.leaveModel.user_name;
  var userLeaveBal = parseInt($scope.leaveModel.user_leaveBalance);



        $http.get('http://localhost:3000/timeoffapi/biodatas').success(function(biodatas){

        var count = 0, ind= 0;
        //console.log("count");
        console.log(biodatas.biodatas[0].user_password);

        for (var key in biodatas.biodatas) {
         if ( useremail == biodatas.biodatas[key].user_email) {
                  var leavebalance = biodatas.biodatas[key].user_leave_balance;
                  var add = leavebalance + userLeaveBal;
           console.log(add);
              $http.put('http://localhost:3000/timeoffapi/biodatas', {email:useremail,leave_balance: add})
        .success(function(data){
            console.log(":)");
            window.location.href='http://localhost:8100/#/main/leavedays';
            window.location.reload(true);
            window.location.reload('/admin');
        }).error(function(data){
            console.log(":(")
        });
            $.jStorage.set("dataserve", biodatas.biodatas[key]);
                 // console.log(biodatas.biodatas[key].user_leave_balance);
            }


        }

    });

  


 }
     
}])


//  .controller('EmailCtrl', function($cordovaEmailComposer, $scope) {
// $cordovaEmailComposer.isAvailable().then(function() {
//    // is available
//    alert("available");
//     console.log("Hello!");
//  }, function () {
//    // not available
//     console.log("Hello!");
//    alert("not available");
//  });
//  $scope.sendEmail = function(){
//   var email = {
//      to: 'teste@example.com',
//      cc: 'teste@example.com',
//      bcc: ['john@doe.com', 'jane@doe.com'],
//      attachments: [
//        'file://img/logo.png',
//        'res://icon.png',
//        'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
//        'file://README.pdf'
//      ],
//      subject: 'Mail subject',
//      body: 'How are you? Nice greetings from Leipzig',
//      isHtml: true
//   };

//  $cordovaEmailComposer.open(email).then(null, function () {
//    // user cancelled email
//   });
//  console.log("Hello!");
//  }
// })

// .controller('FeedbackCtrl', function ($scope, $ionicPopup, $stateParams,$http) {
//   $scope.feedback = {};
//   $scope.SendMail = function(feedback){
//     // var url = urlstr_custom + "feedback/?name=" + $.jStorage.get("name")  + "&comment=" + $scope.feedback.msg;
//     console.log(url);
//     $http.get(url).success(function (data) {
//         $scope.response = data;
//     console.log($scope.response);
//        var alertPopup = $ionicPopup.alert({
//                     title: 'Success',
//                     template: $scope.response[0].status
//                 });

//            $scope.feedback.msg = '';

   
//     });
//   };
  
// })




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

