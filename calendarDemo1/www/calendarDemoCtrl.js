angular.module('calendarDemoApp', ['ionic', 'ngAnimate', 'ui.rCalendar'])
    .run(function ($ionicPlatform, $animate) {
        'use strict';
        $animate.enabled(false);
    })
    .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
      $ionicConfigProvider.tabs.position('bottom');

        'use strict';
        $stateProvider
            .state('tabs', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tabs.home', {
                url: '/home',
                views: {
                    'home-tab': {
                        templateUrl: 'templates/home.html',
                        controller: 'CalendarDemoCtrl'
                    }
                }
            })
            .state('tabs.about', {
                url: '/about',
                views: {
                    'about-tab': {
                        templateUrl: 'templates/about.html'
                    }
                }
            })
            .state('tabs.contact', {
                url: '/contact',
                views: {
                    'contact-tab': {
                        templateUrl: 'templates/contact.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/tab/home');
    })

    .controller('CalendarDemoCtrl', function ($scope,$http) {
        'use strict';
        $scope.calendar = {};
        $scope.changeMode = function (mode) {
            $scope.calendar.mode = mode;
        };

        $scope.loadEvents = function () {
          readEvents();
            // $scope.calendar.eventSource = $scope.events;

        };

        $scope.onEventSelected = function (event) {
            console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
        };

        $scope.onViewTitleChanged = function (title) {
            $scope.viewTitle = title;
        };

        $scope.today = function () {
            $scope.calendar.currentDate = new Date();
        };

        $scope.isToday = function () {
            var today = new Date(),
                currentCalendarDate = new Date($scope.calendar.currentDate);

            today.setHours(0, 0, 0, 0);
            currentCalendarDate.setHours(0, 0, 0, 0);
            return today.getTime() === currentCalendarDate.getTime();
        };

        $scope.onTimeSelected = function (selectedTime, events) {
            console.log('Selected time: ' + selectedTime + ', hasEvents: ' + (events !== undefined && events.length !== 0));
        };

        function readEvents() {
            $scope.events = [];

            var ip = "http://infomirror.falinux.com:4000";

            // var ip = "http://127.0.0.1:4000";
            // infomirror.falinux.com
            $http.get(ip+"/api/InofMirrorDBs?filter[order]=date%20ASC").then(function (response) {

              $scope.lists = response.data;
              console.log($scope.lists);
              $scope.msg=response;


            // var date = new Date($scope.lists.date);
            // var endDate = new Date($scope.lists.endMeetTime);
            // var eventType = Math.floor(Math.random() * 2);
            // var startDay = Math.floor(Math.random() * 90) - 45;
            //
            // var startMinute = Math.floor(Math.random() * 24 * 60);
            // var endMinute = Math.floor(Math.random() * 180) + startMinute;

            var startTime;
            var endTime;

            for (var i=0;i<$scope.lists.length;i++){
              var date = new Date($scope.lists[i].date);
              var endDate = new Date($scope.lists[i].endMeetTime);
              startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
              console.log(date.toLocaleTimeString());
              // startTIme = new Date($scope.lists[i].date);
              endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), endDate.getHours(), endDate.getMinutes());
              // console.log(">>>"+date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
              $scope.events.push({
                  title: 'Event - ' + $scope.lists[i].person,
                  startTime: startTime,
                  endTime: endTime,
                  allDay: false
              });

            }
            $scope.calendar.eventSource = $scope.events;
            // console.log(">"+$scope.events);
          },
          function (response) { $scope.msg=response;  })
          .catch(function(reason){
            console.log(reason);
            $scope.msg = "error : "+response;
            $scope.calendar.eventSource = [];
          });
            // console.log(">>"+$scope.events);
            // return $scope.events;
        }

        function createRandomEvents() {
            events = [];
            for (var i = 0; i < 50; i += 1) {
                var date = new Date();
                var eventType = Math.floor(Math.random() * 2);
                var startDay = Math.floor(Math.random() * 90) - 45;
                var endDay = Math.floor(Math.random() * 2) + startDay;
                var startTime;
                var endTime;
                if (eventType === 0) {
                    startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                    if (endDay === startDay) {
                        endDay += 1;
                        endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                    }
                    events.push({
                        title: 'All Day - ' + i,
                        startTime: startTime,
                        endTime: endTime,
                        allDay: true
                    });
                } else {
                    var startMinute = Math.floor(Math.random() * 24 * 60);
                    var endMinute = Math.floor(Math.random() * 180) + startMinute;
                    startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                    endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                    // console.log(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                    events.push({
                        title: 'Event - ' + i,
                        startTime: startTime,
                        endTime: endTime,
                        allDay: false
                    });
                }
            }
            return events;
        }
    });
