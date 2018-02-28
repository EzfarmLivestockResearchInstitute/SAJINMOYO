// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform , $localstorage , $ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

/*    window.localStorage.setItem('name','Ian');
    console.log(window.localStorage.getItem('name'));*/


  });

/*  $ionicPlatform.registerBackButtonAction(function(event) {
    if (true) { 
      $ionicPopup.confirm({
        title: '종료확인',
        template: '앱을 종료할까요?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })
    }
  }, 100);*/



})

.constant('SERVER', {
    url: 'http://localhost/'  // korea, ezfarm server - after change  
})

.constant('LIMIT', {
    paging: '5'
})

.constant('LASTINDEX', {
    paging: '1'
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  /* 메뉴 */
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/mo/menu.html",
    controller: 'AppCtrl'
  })

  /* 로그인 */
  .state('app.login', {
    url: "/mainmo",
    views: {
      'tab-search': {
        templateUrl: "mainmo.html"
      }
    }
  })

  /*회원등록*/
  .state('app.loginreg', {
    url: "/loginregmo",
    views: {
      'tab-qnalist': {
        templateUrl: "loginregmo.html"
      }
    }
  })

  /* 묻고 답하기 목록*/
  .state('app.qnalist', {
    url: "/qnalist/:view",
    views: {
      'tab-qnalist': {
        templateUrl: "templates/mo/qnalist.html",
        controller: 'qnalistCtrl'
      }
    }
  })


  /* 묻고 답하기 등록*/
  .state('app.qnareg', {
    url: "/qnareg",
    views: {
      'tab-qnalist': {
        templateUrl: "templates/mo/qnareg.html",
        controller: 'qnaRegCtrl'
      }
    }
  })

  /* 묻고 답하기 상세보기*/
  .state('app.qnaview', {
    url: "/qnaview/:pid",
    views: {
      'tab-qnalist': {
        templateUrl: "templates/mo/qnaview.html",
        controller: 'qnaviewCtrl'
      }
    }
  })

  /* 묻고 답하기 수정*/
  .state('app.qnaupdate', {
    url: "/qnaupdate/:pid",
    views: {
      'tab-qnalist': {
        templateUrl: "templates/mo/qnaupdate.html",
        controller: 'qnaUpdateCtrl'
      }
    }
  })

  /*공지사항 리스트*/
  .state('app.notice', {
    url: "/notice",
    views: {
      'tab-notice': {
        templateUrl: "templates/mo/notice.html",
        controller: 'noticelistCtrl'
      }
    }
  })

  /*공지사항 등록*/
  .state('app.noticereg', {
    url: "/noticereg",
    views: {
      'tab-notice': {
        templateUrl: "templates/mo/noticereg.html",
        controller: 'noticeRegCtrl'
      }
    }
  })

  /*공지사항 수정*/
  .state('app.noticeupdate', {
    url: "/noticeupdate/:pid",
    views: {
      'tab-notice': {
        templateUrl: "templates/mo/noticeupdate.html",
        controller: 'noticeUpdateCtrl'
      }
    }
  })

  /*친구 리스트*/
  .state('app.friendlist', {
    url: "/friendlist",
    views: {
      'tab-friend': {
        templateUrl: "templates/mo/friendlist.html",
        controller: 'friendlistCtrl'
      }
    }
  })

  /*친구 등록*/
  .state('app.friendreg', {
    url: "/friendreg",
    views: {
      'tab-friend': {
        templateUrl: "templates/mo/friendreg.html",
        controller: 'friendlistCtrl'
      }
    }
  })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/qnalist/:item1');
})


.config(['$ionicAppProvider', function($ionicAppProvider){
  $ionicAppProvider.identify({
    app_id : '632143622880',
    api_key: 'AIzaSyA9lKUKtBH0Rn5Les7E7UqZz6qo9o21zrc',
    dev_push : true
  });
}])

;