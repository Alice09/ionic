// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ionic-timepicker', 'starter.controllers', 'starter.services'])

.constant('ApiEndpoint', {
  url: 'http://localhost:8100'
})

.run(function($ionicPlatform, $http, $rootScope, ApiEndpoint) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // CORS 요청 데모
  $http.get(ApiEndpoint.url).
    success(function(data, status, headers, config) {
      console.log(config);
      console.log(status);
      console.log(data);
      $rootScope.name = data.name;
      $rootScope.email= data.email;
      $rootScope.blog = data.blog;
    }).
    error(function(data, status, headers, config) {
      console.log(config);
      console.log(status);
      console.log(data);
    });


    // just checking if the BLE plugin works
    ble.isEnabled(
    function() {
        console.log("Bluetooth is enabled");
    },
    function() {
        console.log("Bluetooth is *not* enabled");
        alert("Bluetooth is *not* enabled");
    }
  );

  });
})

.config(function($stateProvider, $urlRouterProvider,ionicTimePickerProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.test', {
      url: '/test',
      views: {
        'tab-test': {
          templateUrl: 'templates/tab-test.html',
          controller: 'viewerCtrl'
        }
      }
    })
    // .state('tab.list-detail', {
    //   url: '/test/:chatId',
    //   views: {
    //     'tab-chats': {
    //       templateUrl: 'templates/chat-detail.html',
    //       controller: 'ChatDetailCtrl'
    //     }
    //   }
    // })
    .state('tab.ble', {
      url: '/ble',
      views: {
        'tab-ble': {
          templateUrl: 'templates/tab-ble.html',
          controller: 'BLECtrl'
        }
      }
    })
    .state('tab.ble-detail', {
      url: '/ble/:deviceId',
      views: {
        'tab-ble': {
          templateUrl: 'templates/ble-detail.html',
          controller: 'BLEDetailCtrl'
        }
      }
  })

  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

  var timePickerObj = {
    inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
    format: 12,
    step: 30,
    setLabel: 'Set',
    closeLabel: 'Close'
  };
  ionicTimePickerProvider.configTimePicker(timePickerObj);
  console.log((((new Date()).getHours()) + ":"+((new Date()).getMinutes())));
})
;
