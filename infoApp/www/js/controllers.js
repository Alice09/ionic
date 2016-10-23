angular.module('starter.controllers', [])

.controller('AccountCtrl', function($scope) {
  $scope.addToCalendar = function() {
      if (window.plugins && window.plugins.calendar) {
          var hour = $scope.session.time.substring(0,$scope.session.time.indexOf(':'));
          if ($scope.session.time.indexOf("pm")>-1)
              hour = parseInt(hour)+12;
          var today = new Date();
          console.log("Date year" + today.getFullYear() + " mo " + today.getMonth()+ " day " + today.getDate());
          var startDate = new Date(today.getFullYear(),today.getMonth(),today.getDate(),hour,00,00);
          var endDate = new Date();
          endDate.setTime(startDate.getTime() + 3600000);//one hour

          window.plugins.calendar.createEvent($scope.session.title, $scope.session.room, $scope.session.description, startDate, endDate,
              function () {
                  alert($scope.session.title + " has been added to your calendar.");
              },
              function (error) {
                  console.log("Calendar fail " + error);
              });
      }
      else console.log("Calendar plugin not available.");
  }
})

.controller('DashCtrl',
[           '$scope', '$http','$state',"ionicTimePicker",
  function(  $scope,   $http , $state , ionicTimePicker ) {

    $scope.date='';
    $scope.data={};
    $scope.people='';
    $scope.inputs = [];

    var ip = "http://infomirror.falinux.com:4000";

    // var ip = "http://127.0.0.1:4000";
    // infomirror.falinux.com
    $http.get(ip+"/api/InofMirrorDBs?filter[order]=date%20ASC").then(function (response) {

      $scope.lists = response.data;
      console.log($scope.lists);
      $scope.msg=response;
    },
    function (response) { $scope.msg=response;  })
    .catch(function(reason){
      console.log(reason);
      $scope.msg = "error : "+response;
    });

    $scope.put = function(){
      var data = {
        'date':$scope.timeset,
        'person': $scope.people,
        'endMeetTime': $scope.timeset2,
        'place': 'InfomirrorBLE'
        // 'id':0
      };

      var cconfig = {
        headers : {
          "Content-Type": "application/json"
        }
      };

      $http.put(ip+"/api/InofMirrorDBs",JSON.stringify(data),cconfig)
      .then(
        function (response) { $scope.msg=response;  },
        function (response) { $scope.msg=response;  }
      ).catch(function(reason){
        console.log(reason);
      });
    };


    $scope.datapush = function(){
      $scope.inputs.push(
        $scope.data.show
      );
      $scope.people += $scope.data.show+",";
      console.log($scope.people);
    };

    $scope.insert= function(){
        var settime = new Date();
        var ipObj1 = {
          callback: function (val) {      //Mandatory
            if (typeof (val) === 'undefined') {
              console.log('Time not selected');
            } else {
              var setDate = new Date();
              var selectedTime = val % (60 * 60)

              var hours = (val / (60 * 60)).toFixed(0);
              var minutes = selectedTime/60;

              console.log('Selected epoch is : ', val,
               'and the time is ', hours, 'H :', minutes, 'M');

               if (hours.toString().length == 1  ){ hours = '0' + hours; }
               if (minutes.toString().length == 1){ minutes = '0' + minutes; }

               $scope.date  = $scope.timeset = settime.toLocaleDateString()+" "+hours+":"+minutes;
            }
          },
          inputTime: settime.getHours()*60*60,   //Optional
          format: 12,         //Optional
          step: 30,           //Optional
          setLabel: 'Set'    //Optional
        };
        ionicTimePicker.openTimePicker(ipObj1);
      }
          $scope.insert2= function(){
              var settime = new Date();
              var ipObj1 = {
                callback: function (val) {      //Mandatory
                  if (typeof (val) === 'undefined') {
                    console.log('Time not selected');
                  } else {
                    var setDate = new Date();
                    var selectedTime = val % (60 * 60)

                    var hours = (val / (60 * 60)).toFixed(0);
                    var minutes = selectedTime/60;

                   if (hours.toString().length == 1  ){ hours = '0' + hours; }
                   if (minutes.toString().length == 1){ minutes = '0' + minutes; }

                    $scope.timeset2 = settime.toLocaleDateString()+" "+hours+":"+minutes;
                    $scope.date += " ~ "+$scope.timeset2;
                  }
                },
                inputTime: settime.getHours()*60*60,   //Optional
                format: 12,         //Optional
                step: 30,           //Optional
                setLabel: 'Set2'    //Optional
              };
              ionicTimePicker.openTimePicker(ipObj1);
            }

}])

.controller('viewerCtrl',
[           '$scope', '$state', '$http',
  function(  $scope,   $state,   $http ) {
    var ip = "http://infomirror.falinux.com:4000";
    // var ip = "http://127.0.0.1:4000";

    var setDate = new Date();

    console.log(setDate);
    $http.get(ip+"/api/InofMirrorDBs?filter[where][date][lte]='"+setDate+"'"
              + "&filter[where][endMeetTime][gte]='"+setDate+"'")
    .then(function (response) {
      console.log(response.data);
      var meets = response.data;
      for(var tmp in meets){
        // console.log(meets[tmp].date);
        // if(meets[tmp].date <= datetime ){
          //&& tmp.attendance < datetime
          console.log("=================");
          $scope.nowMeet = meets[tmp];
        // }
      }
    });

}])

.controller('BLECtrl', function($scope, BLE) {

  // keep a reference since devices will be added
  $scope.devices = BLE.devices;

  var success = function () {
      if ($scope.devices.length < 1) {
          // a better solution would be to update a status message rather than an alert
          alert("Didn't find any Bluetooth Low Energy devices.");
      }
  };

  var failure = function (error) {
      alert(error);
  };

  $scope.scan = function() {
      BLE.scan().then(
          success, failure
      ).finally(
          function() {
              $scope.$broadcast('scroll.refreshComplete');
          }
      )
  };

})

.controller('BLEDetailCtrl', function($scope, $stateParams, BLE) {
  BLE.connect($stateParams.deviceId).then(
      function(peripheral) {
          $scope.device = peripheral;
      },
      function(error){
        // BLE.disconnect($stateParams.deviceId);
        console.log(JSON.stringify(error));
        // alter(error);
      }
  );

  $scope.onRead = function() {
    var uuid = 'ffffffff-ffff-ffff-ffff-fffffffffff0';
    var chuuid = '13333333-3333-3333-3333-333333330001';

    console.log('>>>:::'+$stateParams.deviceId);
    // BLE.read($stateParams.deviceId,'1800','2A00').then(
    BLE.read($stateParams.deviceId,uuid,chuuid).then(
      function(peripheral) {
        var a = new Uint8Array(peripheral);
        console.log(bytesToString(peripheral));
        $scope.dev = bytesToString(peripheral);
      },
      function(error){
        console.log(error);
      }
    );

    // BLE.read($stateParams.deviceId,uuid,'13333333-3333-3333-3333-333333330002').then(
    //   function(peripheral) {
    //     var a = new Uint8Array(peripheral);
    //     console.log('>>>:'+(a));
    //     console.log(JSON.stringify(peripheral));
    //     $rootScope.place = bytesToString(peripheral);
    //   },
    //   function(error){
    //     console.log(error);
    //   }
    // );

  };

  $('.ip_address').mask('099.099.099.099');

  $scope.onWrite = function(set) {
    var uuid = 'ffffffff-ffff-ffff-ffff-fffffffffff0';
    var chuuid = '13333333-3333-3333-3333-333333330001';
    console.log(set.value);
    ble.write($stateParams.deviceId,uuid,chuuid,stringToBytes(set.value),
      function(peripheral) {
        console.log(peripheral);
      },
      function(error) {
        console.log(error);
      }
    );

  };

})
;

// ASCII only
function stringToBytes(string) {
   var array = new Uint8Array(string.length);
   for (var i = 0, l = string.length; i < l; i++) {
       array[i] = string.charCodeAt(i);
    }
    console.log(JSON.stringify(array));
    console.log(array.toString());
    return array.buffer;
}

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

(function(g){"function"===typeof define&&define.amd?define(["jquery"],g):g(window.jQuery||window.Zepto)})(function(g){var y=function(a,f,d){var k=this,x;a=g(a);f="function"===typeof f?f(a.val(),void 0,a,d):f;k.init=function(){d=d||{};k.byPassKeys=[9,16,17,18,36,37,38,39,40,91];k.translation={0:{pattern:/\d/},9:{pattern:/\d/,optional:!0},"#":{pattern:/\d/,recursive:!0},A:{pattern:/[a-zA-Z0-9]/},S:{pattern:/[a-zA-Z]/}};k.translation=g.extend({},k.translation,d.translation);k=g.extend(!0,{},k,d);a.each(function(){!1!==
d.maxlength&&a.attr("maxlength",f.length);d.placeholder&&a.attr("placeholder",d.placeholder);a.attr("autocomplete","off");c.destroyEvents();c.events();var b=c.getCaret();c.val(c.getMasked());c.setCaret(b+c.getMaskCharactersBeforeCount(b,!0))})};var c={getCaret:function(){var b;b=0;var e=a.get(0),c=document.selection,e=e.selectionStart;if(c&&!~navigator.appVersion.indexOf("MSIE 10"))b=c.createRange(),b.moveStart("character",a.is("input")?-a.val().length:-a.text().length),b=b.text.length;else if(e||
"0"===e)b=e;return b},setCaret:function(b){if(a.is(":focus")){var e;e=a.get(0);e.setSelectionRange?e.setSelectionRange(b,b):e.createTextRange&&(e=e.createTextRange(),e.collapse(!0),e.moveEnd("character",b),e.moveStart("character",b),e.select())}},events:function(){a.on("keydown.mask",function(){x=c.val()});a.on("keyup.mask",c.behaviour);a.on("paste.mask drop.mask",function(){setTimeout(function(){a.keydown().keyup()},100)});a.on("change.mask",function(){a.data("changeCalled",!0)});a.on("blur.mask",
function(b){b=g(b.target);b.prop("defaultValue")!==b.val()&&(b.prop("defaultValue",b.val()),b.data("changeCalled")||b.trigger("change"));b.data("changeCalled",!1)});a.on("focusout.mask",function(){d.clearIfNotMatch&&c.val().length<f.length&&c.val("")})},destroyEvents:function(){a.off("keydown.mask keyup.mask paste.mask drop.mask change.mask blur.mask focusout.mask").removeData("changeCalled")},val:function(b){var e=a.is("input");return 0<arguments.length?e?a.val(b):a.text(b):e?a.val():a.text()},getMaskCharactersBeforeCount:function(b,
e){for(var a=0,c=0,d=f.length;c<d&&c<b;c++)k.translation[f.charAt(c)]||(b=e?b+1:b,a++);return a},determineCaretPos:function(b,a,d,h){return k.translation[f.charAt(Math.min(b-1,f.length-1))]?Math.min(b+d-a-h,d):c.determineCaretPos(b+1,a,d,h)},behaviour:function(b){b=b||window.event;var a=b.keyCode||b.which;if(-1===g.inArray(a,k.byPassKeys)){var d=c.getCaret(),f=c.val(),n=f.length,l=d<n,p=c.getMasked(),m=p.length,q=c.getMaskCharactersBeforeCount(m-1)-c.getMaskCharactersBeforeCount(n-1);p!==f&&c.val(p);
!l||65===a&&b.ctrlKey||(8!==a&&46!==a&&(d=c.determineCaretPos(d,n,m,q)),c.setCaret(d));return c.callbacks(b)}},getMasked:function(b){var a=[],g=c.val(),h=0,n=f.length,l=0,p=g.length,m=1,q="push",s=-1,r,u;d.reverse?(q="unshift",m=-1,r=0,h=n-1,l=p-1,u=function(){return-1<h&&-1<l}):(r=n-1,u=function(){return h<n&&l<p});for(;u();){var v=f.charAt(h),w=g.charAt(l),t=k.translation[v];if(t)w.match(t.pattern)?(a[q](w),t.recursive&&(-1===s?s=h:h===r&&(h=s-m),r===s&&(h-=m)),h+=m):t.optional&&(h+=m,l-=m),l+=
m;else{if(!b)a[q](v);w===v&&(l+=m);h+=m}}b=f.charAt(r);n!==p+1||k.translation[b]||a.push(b);return a.join("")},callbacks:function(b){var e=c.val(),g=c.val()!==x;if(!0===g&&"function"===typeof d.onChange)d.onChange(e,b,a,d);if(!0===g&&"function"===typeof d.onKeyPress)d.onKeyPress(e,b,a,d);if("function"===typeof d.onComplete&&e.length===f.length)d.onComplete(e,b,a,d)}};k.remove=function(){var a=c.getCaret(),d=c.getMaskCharactersBeforeCount(a);c.destroyEvents();c.val(k.getCleanVal()).removeAttr("maxlength");
c.setCaret(a-d)};k.getCleanVal=function(){return c.getMasked(!0)};k.init()};g.fn.mask=function(a,f){this.unmask();return this.each(function(){g(this).data("mask",new y(this,a,f))})};g.fn.unmask=function(){return this.each(function(){try{g(this).data("mask").remove()}catch(a){}})};g.fn.cleanVal=function(){return g(this).data("mask").getCleanVal()};g("*[data-mask]").each(function(){var a=g(this),f={};"true"===a.attr("data-mask-reverse")&&(f.reverse=!0);"false"===a.attr("data-mask-maxlength")&&(f.maxlength=
!1);"true"===a.attr("data-mask-clearifnotmatch")&&(f.clearIfNotMatch=!0);a.mask(a.attr("data-mask"),f)})});
