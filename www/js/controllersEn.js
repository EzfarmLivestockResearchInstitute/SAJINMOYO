angular.module('starter.controllers', ['ngCordova','ionic.service.core','ionic.service.push'])


.controller('AppCtrl', function($scope, $ionicModal, $timeout , $localstorage) {

})

/* 로그인  */
.controller('LoginCtrl', function($scope , $state , $http, $stateParams, SERVER , $ionicPopup , $localstorage , Ccamera , $cordovaFileTransfer , ionPlatform, $ionicLoading){


   //nation list
  $http.post(SERVER.url +'/doSelectNation.do' , {})
    .success(function(response){
      $scope.nationList = response.result.result;

    }); 

  //아이디 패스워드 기억
  if(window.localStorage.getItem('idchk') == "true"){
    document.getElementById('idchk').checked = true;
    document.getElementById('rememberId').value = window.localStorage.getItem('gid');
  }else{
    document.getElementById('idchk').checked = false;
    document.getElementById('rememberId').value = "";
  }

  if(window.localStorage.getItem('passchk') == "true"){
    document.getElementById('passchk').checked = true;
    document.getElementById('password').value = window.localStorage.getItem('gpass');
  }else{
    document.getElementById('passchk').checked = false;
    document.getElementById('password').value = "";
  }


  // 로그인 
  $scope.login = function(){

    var id = document.getElementById('rememberId').value;
    var pass1 = document.getElementById('password').value;
    var chk = document.getElementsByName('chk');
    var gcm_key = document.getElementById('gcm_key').value;
    var token_key = document.getElementById('token_key').value;
    var key_gubun = document.getElementById('key_gubun').value;

    if(id == undefined || id == ""){
      var alertPopup = $ionicPopup.alert({
        title: 'Enter ID',
        template: 'Please enter your ID.'
      });
      return false;
    }

    if(pass1 == undefined || pass1 == ""){
      var alertPopup = $ionicPopup.alert({
        title: 'Enter password',
        template: 'Please enter the password.'
      });

      return false;
    }


    if(id == "" || id == undefined || pass1 == undefined || pass1 == ""){
      
      var alertPopup = $ionicPopup.alert({
        title: 'ID Password',
        template: 'Please enter your ID and password.'
      });      
      return false;
    }else{
      $http.post(SERVER.url +'/doLogin.do' , {id:id , pass1: pass1})
           .success(function(response){

          if(response.resultCode == "9999"){
            var alertPopup = $ionicPopup.alert({
              title: 'ID Password',
              template: 'This is not a registered ID, or the password is incorrect.'
            });              

          }else{
              window.localStorage.setItem('gpid' , response.result.result[0].pid);            
              window.localStorage.setItem('gid' , response.result.result[0].id);              
              window.localStorage.setItem('gpass' , response.result.result[0].pass1);         
              window.localStorage.setItem('gname' , response.result.result[0].name);          
              window.localStorage.setItem('gnickname' , response.result.result[0].nickname);  
              window.localStorage.setItem('gemail' , response.result.result[0].email);        
              window.localStorage.setItem('gflaguser' , response.result.result[0].flaguser);  

              window.localStorage.setItem('gnoticepush' , response.result.result[0].noticepush);  
              window.localStorage.setItem('ganswerpush' , response.result.result[0].answerpush);  
              window.localStorage.setItem('gattc_img' , response.result.result[0].attc_user_id);  

              window.localStorage.setItem('token' , response.token);


              if(chk[0].checked == true){
                window.localStorage.setItem('idchk' , true);                                  
              }else{
                window.localStorage.setItem('idchk' , false);
              }

              if(chk[1].checked == true){
                window.localStorage.setItem('passchk' , true);                                
              }else{
                window.localStorage.setItem('passchk' , false);
              }

              $http.post(SERVER.url +'/loginGcmUpdate.do' , {id:id , gcm_key: gcm_key , token_key:token_key , key_gubun : key_gubun})
                .success(function(response){
                  window.location.replace("mainen.html");
                });
              
          }
      });       
    } 
  };


  // reg 
  $scope.loginReg = function(){

    window.location.href = "loginregen.html";
  };


  // id find
  $scope.idFindPopup = function(){
    $ionicPopup.show({
      scope: $scope,
      title: "Find ID",
      templateUrl: 'idfinden.html',
      buttons: [{text:"Confirm"
                , type:'button-positive' 
                , onTap: function(e){
                    var name = document.getElementById('name').value;
                    var email = document.getElementById('email').value;
  
                    if(name == "" && email == ""){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Find ID!',
                          template: 'Please enter your name and email.'
                        });
                    }else{
                      if(name == "" || name == null){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Find ID!',
                          template: 'Please enter your name.'
                        });                      
                      }

                      if(email == "" || email == null){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Find ID!',
                          template: 'Please enter your email.'
                        });
                      }                      
                    }

                    if(name != "" && email != ""){
                      $http.post(SERVER.url +'/doIdFind.do', {name:name , email:email})
                        .success(function(response){
                          if(response.resultCode == "9999"){
                            //document.getElementById('id').innerText = "등록된 아이디가 없습니다.";          
                            var alertPopup = $ionicPopup.alert({
                              title: 'Find ID!',
                              template: 'This is not a registered ID.'
                            });
                          }else{
                            document.getElementById('id').innerText = response.result.result[0].id;        
                          }
                      });
                    }


                    e.preventDefault();
                  }
                },{text:"Cancel", type:'button-positive'
            }]
    });
  };
  // 아이디 찾기


  //비밀번호 찾기
  $scope.passFindPopup = function(){
    $ionicPopup.show({
      scope: $scope,
      title: "Find password",
      templateUrl: 'passfinden.html',
      buttons: [{text:"Confirm"
                , type:'button-positive' 
                , onTap: function(e){
                    var id = document.getElementById('id').value;
                    var email = document.getElementById('email').value;
  

                    if(id == "" && email == ""){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Find password!',
                          template: 'Please enter your ID and email.'
                        });
                    }else{
                      if(id == "" || id == null){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Find password!',
                          template: 'Please enter your ID.'
                        });                      
                      }

                      if(email == "" || email == null){
                        var alertPopup = $ionicPopup.alert({
                          title: 'Find password!',
                          template: 'Please enter your email.'
                        });
                      }                      
                    }

                    if(id != "" && email != ""){
                      $http.post(SERVER.url +'/doIdFind.do', {id:id , email:email})
                        .success(function(response){
                          if(response.resultCode == "9999"){
                            //document.getElementById('pass1').innerText = "가입된 사용자가 아닙니다.";        
                            var alertPopup = $ionicPopup.alert({
                              title: 'Find password!',
                              template: 'You are not a registered user.'
                            });                          
                          }else{
                            document.getElementById('pass1').innerText = response.result.result[0].pass1;      
                          }
                      });
                    }

                    e.preventDefault();
                  }
                },{text:"Cancel", type:'button-positive'
            }]
    });
  };
  //비밀번호 찾기

  $scope.imgadd = "img/me.png";

  $scope.takePicture = function () {
  
    var options = {
         quality : 50,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: 1,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: 1500,
         targetHeight: 1500,
         saveToPhotoAlbum: true,
         correctOrientation:true,
         mediaType: 1
      };

      Ccamera.getPicture(options).then(function(imageData) {
        $scope.imgadd = imageData;
      }, function(err) {
         console.log(err);
      });
  };  

  $scope.getPicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 0,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1500,
      targetHeight: 1500,
      correctOrientation:true,
      mediaType: 0
      };

      Ccamera.getPicture(options).then(function (imageData) {
        $scope.imgadd = imageData;
      }, function (err) {
      });
  };

  /* 회원 가입*/
  $scope.userReg = function(userReg){

    if(userReg.id == "" || userReg.id == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'ID',
        template: 'Please enter your ID.'
      });
      return false;
    }

    if(userReg.name2 == "" || userReg.name2 == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'Name',
        template: 'Please enter your name.'
      });      
      return false;
    }      
    if(userReg.nickname == "" || userReg.nickname == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'Nickname',
        template: 'Please enter your nickname.'
      });            
      return false;
    }
    if(userReg.password1 == "" || userReg.password1 == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Please enter the password.'
      });          
      return false;
    }    
    if(userReg.password2 == "" || userReg.password2 == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Please confirm the password.'
      });
      return false;
    }
    if(userReg.email == "" || userReg.email == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'Email',
        template: 'Please enter your email.'
      });      
      return false;
    }      

    if(userReg.country == "" || userReg.country == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'Nation',
        template: 'Please enter your nation.'
      });      
      return false;
    }

    if(userReg.affiliation == "" || userReg.affiliation == undefined){
      var alertPopup = $ionicPopup.alert({
        title: 'belong',
        template: 'Please enter your belong.'
      });      
      return false;
    }


    if(userReg.password1 != userReg.password2){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Incorrect password. Please try again.'
      });      
      return false;
    }

    //저장
    $scope.idchk(userReg);

  };
  /* 회원 가입*/


  /* id 중복 체크 및 저장 */
  $scope.idchk = function(userReg){

    $scope.attc_id = "";
    $http.post(SERVER.url +'/idChk.do', {id: userReg.id})

      .success(function(response){
          if(response.result == "return"){
            var alertPopup = $ionicPopup.alert({
              title: 'ID',
              template: 'This is a duplicate ID.'
            });            

            $scope.userReg.id = "";
            focus('id');
            return false;
            
          }else{
            var resultCode = "";

            if($scope.imgadd != "img/me.png"){
              var d = new Date();
              var ft = new FileTransfer();
              //사진
              var imageURI = $scope.imgadd + "";
              var pictureOptions = new FileUploadOptions();
                  pictureOptions.fileKey = "file";
                  //options.mimeType="image/jpeg";


              $scope.attc_user_id = d.getMilliseconds()+"_"+userReg.id+"_"+d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg";

              pictureOptions.mimeType = userReg.id+":u:"+d.getMilliseconds(); 
              pictureOptions.fileName = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg"
              ft.upload(imageURI, SERVER.url +"/userRegAttach.do", function win(r){}, function win(error){}, pictureOptions);
            }

            $http.post(SERVER.url +'/loginReg.do', {id: userReg.id , name:userReg.name2 , nickname:userReg.nickname , pass1: userReg.password1, pass2:userReg.password2 , email:userReg.email , attc_user_id:$scope.attc_user_id , gcm_key:document.getElementById('gcm_key').value})
              .success(function(response){
                  var alertPopup = $ionicPopup.alert({
                    title : 'Sign up' ,
                    template: 'Saved.'
                  });
              
                  alertPopup.then(function(res){
                    window.location.replace("loginen.html");
                  });
              })
          }
      });

  };
  /* id 중복 체크  */


})
/* 로그인  */





/* 묻고답하기 리스트 */
.controller('qnalistCtrl', function($scope, $http, $state , $stateParams, SERVER, $ionicLoading, $localstorage, $timeout, $ionicPopup , LIMIT , LASTINDEX) {


  if(localStorage.getItem("token") == null || localStorage.getItem("token") == ""){
    //alert("다시 로그인 해주세요");
    window.location.replace("index.html");
    return false;
  }

  // 로딩중
  $ionicLoading.show({
    duration: 300,
    noBackdrop: true,
    template: '<p class="item-icon-left">Loading...<ion-spinner icon="lines"/></p>'
  });

  $scope.livestock = "0";
  //축종 
  $http.post(SERVER.url +'/livestockList.do',{})
    .success(function(response){
      $scope.likestock = response.result;
    });

  //축종변셩시 조회
  $scope.livestockChange = function(value){
    console.log(value);
    if($scope.gflaguser == "0"){
      $http.post(SERVER.url +'/boardListAdmin.do' , {user_id: window.localStorage.getItem('gid') ,livestock: value , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.qnalist = response.result;  
        $scope.hasMoreData = true;
      });
    }else{
      $http.post(SERVER.url +'/boardList.do' , {user_id: window.localStorage.getItem('gid') ,livestock: value , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.qnalist = response.result;  
        $scope.hasMoreData = true;
      });
    }
  }


  //paging
  $scope.hasMoreData = true;
  $scope.qnauser = window.localStorage.getItem('gid');    
  $scope.gflaguser = window.localStorage.getItem('gflaguser');

  $scope.qnalist = {};  

  if($stateParams.view == "item1"){
    $scope.active = 'item1';  
  }else if($stateParams.view == "item2"){
    $scope.active = $stateParams.view; 
  }else{
    $scope.active = 'item1'; 
  }

  
  $scope.setActive = function(type) {
    $scope.active = type;   
  };

  $scope.isActive = function(type){
    return type === $scope.active;
  };

  $scope.animalsOie = "0";

  /*조회버튼 클릭*/
  $scope.qnasearch = function(){
    var search = document.getElementById('search').value;

    if($scope.gflaguser == "0"){
      $http.post(SERVER.url +'/boardListAdmin.do' , {user_id: window.localStorage.getItem('gid') ,title: search , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.qnalist = response.result;  
        $scope.hasMoreData = true;
      });
    }else{
      $http.post(SERVER.url +'/boardList.do' , {user_id: window.localStorage.getItem('gid') ,title: search , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.qnalist = response.result;  
        $scope.hasMoreData = true;
      });
    }
  };

  /* 새로 고침 */
  $scope.doRefresh = function(){
    var search = document.getElementById('search').value;
    if($scope.gflaguser == "0"){
      $http.post(SERVER.url +'/boardListAdmin.do' , {user_id: window.localStorage.getItem('gid') ,title: search , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
      .success(function(response){
        $scope.qnalist = response.result;  
        $scope.hasMoreData = true;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }else{
      $http.post(SERVER.url +'/boardList.do' , {user_id: window.localStorage.getItem('gid') ,title: search , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
      .success(function(response){
        $scope.qnalist = response.result;  
        $scope.hasMoreData = true;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  };

  //paging
  $scope.loadMore = function() {

    var search = document.getElementById('search').value;

    if($scope.gflaguser == "0"){
      $http.post(SERVER.url +'/boardListAdmin.do' , {user_id: window.localStorage.getItem('gid') , title: search , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:$scope.qnalist.length+1})
          .success(function(response){
            $scope.qnalistadd = response.result;

            if($scope.qnalist.length === undefined){
              $http.post(SERVER.url +'/boardListAdmin.do' , {user_id: window.localStorage.getItem('gid') ,id: $stateParams.id, qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
                .success(function(response){
                  $scope.qnalist = response.result;  
              });
            }else{
              if(response.result != ""){            
                $scope.qnalist = $scope.qnalist.concat($scope.qnalistadd);
                $scope.hasMoreData = true;
              }else{
                $scope.hasMoreData = false;  
              }          
            }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }else{
      $http.post(SERVER.url +'/boardList.do' , {user_id: window.localStorage.getItem('gid') , title: search , qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:$scope.qnalist.length+1})
        .success(function(response){
          $scope.qnalistadd = response.result;

          if($scope.qnalist.length === undefined){
            $http.post(SERVER.url +'/boardList.do' , {user_id: window.localStorage.getItem('gid') ,id: $stateParams.id, qnaOrderValue:'0',limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
              .success(function(response){
                $scope.qnalist = response.result;  
            });
          }else{
            if(response.result != ""){            
              $scope.qnalist = $scope.qnalist.concat($scope.qnalistadd);
              $scope.hasMoreData = true;
            }else{
              $scope.hasMoreData = false;  
            }          
          }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });      
    }
  };
    
  // 수정 화면으로 이동  
  $scope.update = function(qnadetail){
    $state.go('app.qnaupdate',{pid:qnadetail.pid});
  };

  //등록 화면으로 이동  
  $scope.regqna = function(){
    $state.go('app.qnareg',"");
  };


  //삭제
  $scope.remove = function(qnadetail){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete',
      template: 'Would you like to delete?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $scope.qnalist.splice($scope.qnalist.indexOf(qnadetail), 1);

        $http.post(SERVER.url +'/qnaDel.do', {pid: qnadetail.pid})
          .success(function(response){

          });
      }else{
         
      }
     });
  }
  
  $scope.order = "0"; 
  $scope.qnaorder = function(value){
    
    var orderValue = "";

    if(value === "0"){
      qnaOrderValue = "0";
    }else if(value === "1"){
      qnaOrderValue = "1";
    }else if(value === "2"){
      qnaOrderValue = "2";
    }

    var search = document.getElementById('search').value;
    if($scope.gflaguser == "0"){
      $http.post(SERVER.url +'/boardListAdmin.do' , {user_id: window.localStorage.getItem('gid') ,id: $stateParams.id , qnaOrderValue: qnaOrderValue , title: search , limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.qnalist = response.result;  
      });
    }else{
      $http.post(SERVER.url +'/boardList.do' , {user_id: window.localStorage.getItem('gid') ,id: $stateParams.id , qnaOrderValue: qnaOrderValue , title: search , limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.qnalist = response.result;  
      });      
    }

  };

  $scope.qnalistDetail = function(pid){
    $state.go('app.qnaview',{pid:pid}, {reload: true, inherit: false});      
  };


})


/* 묻고 답하기 등록 */
.controller('qnaRegCtrl' , function($scope , $http , $state , $stateParams , SERVER , $ionicPopup , Ccamera , $ionicModal , $cordovaFileTransfer , LIMIT , LASTINDEX , $ionicLoading , $cordovaGeolocation){


  //축종 기본값
  $scope.livestock_value = "0";

  $scope.livestock_select = function(value){
    // 질병
    $http.post(SERVER.url +'/oieList.do',{cat_code : value})
      .success(function(response){
        $scope.oie = response.result;
      });   
  };


  //축종 
  $http.post(SERVER.url +'/livestockList.do',{})
    .success(function(response){
      $scope.likestock = response.result;
    });     


  var latitude = "";
  var longitude = "";

  $scope.la = "47.919132";
  $scope.lo = "106.921617";

  var myLatlng = new google.maps.LatLng($scope.la,$scope.lo);
  var mapOptions = {
      center: myLatlng,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  var map = new google.maps.Map(document.getElementById("map"),mapOptions);
  var marker = new google.maps.Marker({
    position : myLatlng ,
    map : map ,
    title : 'Click to zoom'
  });

  map.addListener('click' , function(event){

    var laloString = event.latLng + "";
    var latlngArr = laloString.split(',');

    var la = latlngArr[0].replace("(","");
    var lo = latlngArr[1].replace(")","");

    $scope.la = la.replace(/(\s*)/g,"");
    $scope.lo = lo.replace(/(\s*)/g,"");
    
    map.setZoom(10);
    marker.setMap(null);
    placeMarker(event.latLng);
  });


  var posOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
    };
  $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position){

    $scope.lo = position.coords.latitude;
    $scope.la = position.coords.longitude;
    var myLatlng2 = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    map.setCenter(myLatlng2);
    marker.setMap(null);
    placeMarker(myLatlng2);

  },function(err){
    console.log("err",err);
  });


  function placeMarker(location){
    var clickedLocation = new google.maps.LatLng(location);
    marker = new google.maps.Marker({position : location , map : map});
    //map.setCenter(location);

  }


  $scope.open_scope_select = function(value){
    if(value === "03"){
      //전문가 선택시 지정친구
      $http.post(SERVER.url +'/openFriendList.do', {pid:window.localStorage.getItem('gpid')})
        .success(function(response){
          $scope.open_friend_list = response.result;

        });      
      $scope.modal_friend.show();
    }else if(value === "05"){
      //전문가 선택시 그룹친구
      $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
        .success(function(response){
        $scope.grouplist = response.result;  
        
      });      
    }
  };

  $scope.open_scope_click = function(value){
    if(value === "03"){
      //지정친구 일때ㅔ
      $http.post(SERVER.url +'/openFriendList.do', {pid:window.localStorage.getItem('gpid'),answer_pid:$stateParams.pid})
        .success(function(response){
          $scope.open_friend_list = response.result;

        });      
      $scope.modal_friend.show();
    }else if(value === "05"){
      //전문가 선택시 그룹친구
      $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
        .success(function(response){
        $scope.grouplist = response.result;  
        
      });      
    }
  };  


  $ionicModal.fromTemplateUrl('templates/en/open_friend.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal_friend = modal;
  });

  $scope.select_pid = "";
  $scope.select_user_id = "";
  $scope.select_friend_sn = "";

  $scope.open_friend_ok = function(open_friend_detail){
    var selectFriend = "";
    var selectFriendNickname = "";
    for(var i = 0; i < open_friend_detail.length; i++){
      if(open_friend_detail[i].select_pid === "true" || open_friend_detail[i].select_pid === true){
        selectFriend += ":" + open_friend_detail[i].friend_sn;
        selectFriendNickname += "," + open_friend_detail[i].nickname;
      }
    }

    $scope.select_friend_sn = selectFriend.substring(1);
    $scope.select_friend_nickname = selectFriendNickname.substring(1);
    $scope.modal_friend.hide();
  };

  $scope.qnaReg = {nickname:window.localStorage.getItem('gnickname')};
    

  //묻고답하기 저장
  $scope.qnaValchk = function(qnaReg){
    
    if(qnaReg.title == "" || qnaReg.title == undefined){
      var alertPopup = $ionicPopup.alert({
        title : 'Title' ,
        template: 'Please enter the title.'
      });
      return false;
    }    

/*    if(qnaReg.address == "" || qnaReg.address == undefined){
      var alertPopup = $ionicPopup.alert({
        title : 'Address' ,
        template: 'Please enter your address.'
      });
      return false;
    }*/

    if(qnaReg.expert == "" || qnaReg.expert == undefined){
      var alertPopup = $ionicPopup.alert({
        title : 'Expert' ,
        template: 'Please select the expertise category.'
      });
      return false;
    }

    
    if(qnaReg.expert == "0"){
      if(qnaReg.open_scope == "" || qnaReg.open_scope == undefined){
        var alertPopup = $ionicPopup.alert({
          title : 'Scope of disclosure' ,
          template: 'Please enter the scope of disclosure.'
        });
        return false;
      }
    }


    if(qnaReg.livestock == "" || qnaReg.livestock == undefined){
      var alertPopup = $ionicPopup.alert({
        title : 'Type of animals' ,
        template: 'Please enter the type of animals.'
      });
      return false;
    }            

    if(qnaReg.contents == "" || qnaReg.contents == undefined){
      var alertPopup = $ionicPopup.alert({
        title : 'Comment' ,
        template: 'Please enter your comment.'
      });
      return false;
    }
  

    var group_sn = "";
    //그룹친구일 경우에만 그룹순번을 넣어줌
    if(qnaReg.open_scope == "05"){
      group_sn = document.getElementById('group_sn').value;
    }

    var oie = document.getElementById("oie_cd").value;

    var resultCode = "";
    var resultpid
    $http.post(SERVER.url +'/qnaReg.do', {pid:window.localStorage.getItem('gpid') , user_id:window.localStorage.getItem('gid') , title: qnaReg.title , contents : qnaReg.contents , address_pid:qnaReg.addresspid , address_detail:qnaReg.address , expert:qnaReg.expert , open_scope:qnaReg.open_scope , livestock:qnaReg.livestock ,oie_cd:oie, select_friend_sn : $scope.select_friend_sn , group_sn : group_sn , la : $scope.la , lo : $scope.lo})
      .success(function(response){

        resultpid = response.result.resultPid;

        if($scope.imageall != ""){
          //사진
          var imageURI = $scope.imageall + "";

          var imageSplit = imageURI.split(',');
          var pictureOptions = new FileUploadOptions();
              pictureOptions.fileKey = "file";
        
          for(var i = 0; i< imageSplit.length; i++){
            var d = new Date();
            var ft = new FileTransfer();

            pictureOptions.mimeType = response.result.resultPid+":p:"+d.getMilliseconds(); 
            pictureOptions.fileName = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg"
            ft.upload(imageSplit[i], SERVER.url +"/qnaRegAttach.do", function win(r){}, function win(error){}, pictureOptions);
          }
        }

        if($scope.videos != ""){
          //동영상
          var videoURI = $scope.videos + "";
          var videoSplit = videoURI.split(',');

          var videoOptions = new FileUploadOptions();
              videoOptions.fileKey = "file";
              
          var ft = new FileTransfer();

          for(var i = 0; i< videoSplit.length; i++){
            var d = new Date();
            ft.onprogress = function(progressEvent) {

            if(progressEvent.lengthComputable){
              var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
              
              $ionicLoading.show({
                duration: 300,
                noBackdrop: false,
                animation:'fade-in',
                template: '<p class="item-icon-left">Saving…'+perc+'%<ion-spinner icon="lines"/></p>'
              });              
            } 
          };

            videoOptions.mimeType = response.result.resultPid+":v:"+d.getMilliseconds();
            videoOptions.fileName = d.getMilliseconds() + "_" + videoSplit[i];
            var videoNm = d.getMilliseconds() + "_" + videoSplit[i];
            ft.upload(videoSplit[i], SERVER.url +"/qnaRegVideoAttach.do", function win(r){}, function win(error){}, videoOptions);

          }
        }

        $http.post(SERVER.url + "/boardList.do",{user_id: window.localStorage.getItem('gid') , qnaOrderValue: '0' , limitList:LIMIT.paging , lastIndex:LASTINDEX.paging})
        .success(function(response){
          $scope.qnalist = response.result;
          if(response.resultCode == '0000'){
            $state.go('app.qnalist',"");
          }
        });          

      })

      .finally(function(){
        $http.post(SERVER.url +'/qnaRegPush.do', {pid:resultpid , user_id:window.localStorage.getItem('gid') , title: qnaReg.title , contents : qnaReg.contents , address_pid:qnaReg.addresspid , address_detail:qnaReg.address , expert:qnaReg.expert , open_scope:qnaReg.open_scope , livestock:qnaReg.livestock , select_friend_sn : $scope.select_friend_sn , group_sn : group_sn})
          .success(function(response){

          });
      });
  };


  $scope.imgadd = "http://placehold.it/300x300";
  $scope.imageall = [];
  $scope.videos = [];
  $scope.takePicture = function () {
  
    var options = {
         quality : 50,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: 1,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: 1500,
         targetHeight: 1500,
         saveToPhotoAlbum: true,
         mediaType: 1
      };

      Ccamera.getPicture(options).then(function(imageData) {
        $scope.imgadd = imageData;
        $scope.imageall = $scope.imageall.concat($scope.imgadd);
      }, function(err) {
         console.log(err);
      });
  };  

  

  $scope.getPicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 0,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1500,
      targetHeight: 1500,
      mediaType: 0
      };

      Ccamera.getPicture(options).then(function (imageData) {

        $scope.imgadd = imageData;
        $scope.imageall = $scope.imageall.concat($scope.imgadd);
      }, function (err) {
          
      });
  };
    
  $scope.takeVideo = function () {
    var options = {
      limit: 1,
      duration: 10
    };

    navigator.device.capture.captureVideo(function onSuccess(mediaFiles){
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
        console.log(mediaFiles);
        console.log(path);
        $scope.videoFullpath = path;
        $scope.videos = $scope.videos.concat($scope.videoFullpath);
      }
    },function onError(error){},options);
  };

  $scope.getVideo = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 2,
      allowEdit: false,
      targetWidth: 1500,
      targetHeight: 1500,
      mediaType: 1
      };

      Ccamera.getPicture(options).then(function (imageData) {

        $scope.videoadd = imageData;
        $scope.videos = $scope.videos.concat($scope.videoadd);
      }, function (err) {
          // An error occured. Show a message to the user
      });
  };   

  //클릭한 사진 삭제 
  $scope.imgRemove = function(attach){

     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete',
       template: 'Would you like to delete?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          var imageArray = $scope.imageall;
          imageArray.splice(imageArray.lastIndexOf(attach),1);
          $scope.imageall = imageArray;
       } else {
         
       }
     });  
  };

  $scope.videoRemove = function(video){
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete',
       template: 'Would you like to delete?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          var videoArray = $scope.videos;
          videoArray.splice(videoArray.lastIndexOf(video),1);
          $scope.videos = videoArray;
       } else {
         
       }
     });  
  };
})

.filter('trusted', ['$sce',function ($sce){
  return function(url){
    return $sce.trustAsResourceUrl(url);
  };
}])

/* 묻고 답하기 상세 */
.controller('qnaviewCtrl', function($scope, $http,  $state , $stateParams, SERVER , $localstorage , $ionicPopup , $ionicModal, $ionicLoading, $cordovaFileTransfer) {
 
  $scope.zoomurl = "";
  $scope.imgPopup =  function(attach){
    $scope.zoomurl = encodeURI(attach.attc_file);
    $scope.modalimgview.show();
  };

  $ionicModal.fromTemplateUrl('templates/en/imageview.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalimgview = modal;
  });
  $scope.closeViewModal = function() {
    $scope.modalimgview.hide();
  };

  $scope.qnaview = {};
  $scope.answerList = [];
  $scope.attchList = [];
  $scope.attchList2 = [];
  $scope.guser_id = window.localStorage.getItem('gid');

  $scope.imglist = false;
  $scope.videolist = false;

  
  $http.get(SERVER.url +'/boardView.do?pid='+$stateParams.pid)
    .success(function(response){
      
      $ionicLoading.show({
        duration: 300,
        noBackdrop: true,
        template: '<p class="item-icon-left">Loading…<ion-spinner icon="lines"/></p>'
      });

      $scope.qnaview = response.result.boardResult[0];   
      $scope.answerList = response.result.replyResult;   
      $scope.attchList = response.result.attchResult;    
      $scope.attchList2 = response.result.attchResult2;  

      $scope.la = $scope.qnaview.la;
      $scope.lo = $scope.qnaview.lo;

      var myLatlng = new google.maps.LatLng($scope.la,$scope.lo);      
      var mapOptions = {
          center: myLatlng,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      var map = new google.maps.Map(document.getElementById("map"),mapOptions);
      map.setCenter(myLatlng);

      var marker = new google.maps.Marker({
        position : myLatlng ,
        map : map ,
        title : 'Click to zoom'
      });      

      if(response.result.attchResult == "" || response.result.attchResult == null){
        $scope.imglist = false;
      }else{
        $scope.imglist = true;
      }

      if(response.result.attchResult2 == "" || response.result.attchResult2 == null){
        $scope.videolist = false;
      }else{
        $scope.videolist = true;
      }
    });  


  $scope.imgDown = function(attach){

    var url = encodeURI(attach.attc_file);
    var filename = url.split("/").pop();
    var targetPath = cordova.file.externalRootDirectory + 'Pictures/'+'IMG_'+filename;

    $cordovaFileTransfer.download(url,targetPath,{},true).then(function(result){
      var alertPopup = $ionicPopup.alert({
          title : 'Save' ,
          template: 'Saved'
        });
      }, function(error){

      },function(progress){
        var perc = Math.floor(progress.loaded / progress.total * 100);
        $ionicLoading.show({
          duration: 300,
          noBackdrop: true,
          template: '<p class="item-icon-left">Saving…'+perc+'%<ion-spinner icon="lines"/></p>'
        });
      });
 
  };

  $scope.videoDown = function(attach){

    var url = encodeURI(attach.attc_file);
    var filename = url.split("/").pop();
    var targetPath = cordova.file.externalRootDirectory + 'Movies/'+filename;

    $cordovaFileTransfer.download(url,targetPath,{},true).then(function(result){
      var alertPopup = $ionicPopup.alert({
        title : 'Save' ,
        template: 'Saved'
      });
    }, function(error){
      
      
    },function(progress){
      var perc = Math.floor(progress.loaded / progress.total * 100);
      $ionicLoading.show({
        duration: 300,
        noBackdrop: true,
        template: '<p class="item-icon-left">Saving…'+perc+'%<ion-spinner icon="lines"/></p>'
      });
    });
  };  



  //댓들 등록
  $scope.answerReg = function(qnaView){

    var answerYn = document.getElementById('answer').value;
    if(answerYn == "" || answerYn == null){
      return false;
    }

    $http.post(SERVER.url +'/answerReg.do', {pid: $stateParams.pid , reg_id: window.localStorage.getItem('gid') , reply_cn: qnaView.answer , user_id:$scope.qnaview.user_id})
      .success(function(response){

          if(response.result.resultCode == '0000'){

            $http.get(SERVER.url +'/boardView.do?pid='+$stateParams.pid)
              .success(function(response){
                  $scope.qnaview = response.result.boardResult[0];  
                  $scope.answerList = response.result.replyResult;  
              });
              document.getElementById('answer').value = "";     
          }else{
            alert(response);
          } 
      });
  };

  //댓글 삭제
  $scope.remove = function(answerdetail){

     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete',
       template: 'Would you like to delete?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          $scope.answerList.splice($scope.answerList.indexOf(answerdetail), 1);
          $http.post(SERVER.url +'/answerDel.do', {pid: answerdetail.pid ,reply_sn: answerdetail.reply_sn})
            .success(function(response){

            });
       } else {
         
       }
     });
  };

  // 댓글 사젝
  $scope.update = function(answerdetail){
    $scope.modal.show();

    $scope.pid = answerdetail.pid;
    $scope.reply_cn = answerdetail.reply_cn;
    $scope.reply_sn = answerdetail.reply_sn;

  };


  //댓글 수정modal
  $ionicModal.fromTemplateUrl('templates/en/answerupdate.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  //댓글 수정 저장
  $scope.answerUpdate = function(pid,reply_sn,reply_cn){

    $http.post(SERVER.url +'/answerUpdate.do', {pid: pid ,reply_sn: reply_sn , reply_cn:document.getElementById('reply_cn').value})
      .success(function(response){
          
          $http.get(SERVER.url +'/boardView.do?pid='+$stateParams.pid)
            .success(function(response){
                $scope.qnaview = response.result.boardResult[0];  
                $scope.answerList = response.result.replyResult;  
            });
          $scope.closeModal();
      });
  };

  //목록으로
  $scope.qnalist = function(){
    //$state.go('app.qnalist',{},{reload: true});
    //$state.go('app.qnalist',{}, {reload: true, inherit: false}); 
    $state.go('app.qnalist',"");
  };


})
/* 묻고 답하기 상세 */



/* 묻고답하기 수정*/
.controller('qnaUpdateCtrl', function($scope , $http , $stateParams , SERVER , $ionicModal, $ionicPopup ,$state , Ccamera , $cordovaFileTransfer , $ionicLoading){
  $scope.attchList = [];
  $scope.attchList2 = [];
  $scope.imgAll = [];
  $scope.videoAll = [];

  $scope.livestock = "0";
  //축종 
  $http.post(SERVER.url +'/livestockList.do',{})
    .success(function(response){
      $scope.likestock = response.result;
    });

    //축종 변경
  $scope.livestock_select = function(value){
    // 질병
    $http.post(SERVER.url +'/oieList.do',{cat_code : value})
      .success(function(response){
        $scope.oie = response.result;
      });
      $scope.qnaView.oie_cd = "99";
  };


  $http.post(SERVER.url + "/qnadetail.do" , {pid: $stateParams.pid})
    .success(function(response){
      $scope.qnaView = response.result.boardResult[0];
      $scope.select_friend_sn = response.result.boardResult[0].select_friend_sn;
      $scope.attchList = response.result.attchResult;     
      $scope.attchList2 = response.result.attchResult2;     


    //질병
      $http.post(SERVER.url +'/oieList.do',{cat_code : response.result.boardResult[0].livestock})
        .success(function(response){
          $scope.oie = response.result;
        });  

      var myLatlng = new google.maps.LatLng($scope.qnaView.la,$scope.qnaView.lo);
      var mapOptions = {
          center: myLatlng,
          zoom: 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      var map = new google.maps.Map(document.getElementById("map"),mapOptions);

      var marker = new google.maps.Marker({
        position : myLatlng ,
        map : map ,
        title : 'Click to zoom'
      });
      
      // 조회 초기값 셋팅
      $scope.la = $scope.qnaView.la;
      $scope.lo = $scope.qnaView.lo;

      map.addListener('click' , function(event){

        var laloString = event.latLng + "";
        var latlngArr = laloString.split(',');

        var la = latlngArr[0].replace("(","");
        var lo = latlngArr[1].replace(")","");

        $scope.la = la.replace(/(\s*)/g,"");
        $scope.lo = lo.replace(/(\s*)/g,"");
        
        map.setZoom(10);
        //map.setCenter(event.latLng);
        marker.setMap(null);
        placeMarker(event.latLng);

      });

      function placeMarker(location){
        var clickedLocation = new google.maps.LatLng(location);
        marker = new google.maps.Marker({position : location , map : map});
        //map.setCenter(location);

      }


      //사진
      for(var i=0; i<response.result.attchResult.length;i++){
        $scope.imgAll = $scope.imgAll.concat(response.result.attchResult[i].attc_file);
      }

      //동영상
      for(var i=0; i<response.result.attchResult2.length;i++){
        $scope.videoAll = $scope.videoAll.concat(response.result.attchResult2[i].attc_file);
      }
      
    });

    //그룹조회
    $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
      .success(function(response){
      $scope.grouplist = response.result;  
      
    });


  $scope.open_scope_select = function(value){
    //지정친구 일때ㅗ
    if(value === "03"){
      $http.post(SERVER.url +'/openFriendList.do', {pid:window.localStorage.getItem('gpid'),answer_pid:$stateParams.pid})
        .success(function(response){
          $scope.open_friend_list = response.result;

        });      
      $scope.modal_friend_update.show();
    }else if(value == "05"){

      //전문가 선택시 그룹친구
      $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
        .success(function(response){
        $scope.grouplist = response.result;  
        
      }); 

      $scope.select_friend_sn = "";
      $scope.select_friend_nickname = "";      
    }else{
      $scope.select_friend_sn = "";
      $scope.select_friend_nickname = "";
    }
  };

  $scope.open_scope_click = function(value){
    //지정친구 일때ㅗ
    if(value === "03"){
      $http.post(SERVER.url +'/openFriendList.do', {pid:window.localStorage.getItem('gpid'),answer_pid:$stateParams.pid})
        .success(function(response){
          $scope.open_friend_list = response.result;

        });      
      $scope.modal_friend_update.show();
    }else if(value == "05"){

      //전문가 선택시 그룹친구
      $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
        .success(function(response){
        $scope.grouplist = response.result;  
        
      }); 
      $scope.select_friend_sn = "";
      $scope.select_friend_nickname = "";      
    }else{
      $scope.select_friend_sn = "";
      $scope.select_friend_nickname = "";
    }
  };

  $ionicModal.fromTemplateUrl('templates/en/open_friend_update.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal_friend_update = modal;
  });


  $scope.select_pid = "";
  $scope.select_user_id = "";
  $scope.select_friend_sn = "";

  $scope.open_friend_ok = function(open_friend_detail){
    var selectFriend = "";
    var selectFriendNickname = "";

    for(var i = 0; i < open_friend_detail.length; i++){
      if(open_friend_detail[i].select_pid === "true" || open_friend_detail[i].select_pid === true){
        selectFriend += ":" + open_friend_detail[i].friend_sn;
        selectFriendNickname += "," + open_friend_detail[i].nickname;
      }
    }

    $scope.select_friend_sn = selectFriend.substring(1);
    $scope.select_friend_nickname = selectFriendNickname.substring(1);
    $scope.modal_friend_update.hide();
  };

  $scope.imgadd = "http://placehold.it/300x300";
  $scope.takePicture = function (options) {
  
    var options = {
         quality : 50,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: 1,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: 1500,
         targetHeight: 1500,
         saveToPhotoAlbum: true,
         mediaType: 1
      };

      Ccamera.getPicture(options).then(function(imageData) {
        $scope.imgadd = imageData;
        $scope.imgAll = $scope.imgAll.concat($scope.imgadd);

        var imageURI = $scope.imgadd + "";

        var d = new Date();
        var ft = new FileTransfer();

        ft.onprogress = function(progressEvent) {

          if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            
            $ionicLoading.show({
              duration: 300,
              noBackdrop: true,
              template: '<p class="item-icon-left">Saving…'+perc+'%<ion-spinner icon="lines"/></p>'
            });
          } 
        };

        var imageSplit = imageURI.split(',');
        var pictureOptions = new FileUploadOptions();
            pictureOptions.fileKey = "file";
            
            pictureOptions.mimeType = $stateParams.pid+":p:"+d.getMilliseconds();
            pictureOptions.fileName = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg"

            ft.upload(imageData, SERVER.url +"/qnaRegAttach.do", function win(r){}, function win(error){}, pictureOptions);

      }, function(err) {
         console.log(err);
      });
  };  

  
  $scope.getPicture = function () {
    var options = {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: 0,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 1500,
          targetHeight: 1500,
          mediaType: 0
      };

      Ccamera.getPicture(options).then(function (imageData) {

        $scope.imgadd = imageData;
        $scope.imgAll = $scope.imgAll.concat($scope.imgadd);
        //사진
        var imageURI = $scope.imgadd + "";
        var d = new Date();
        var ft = new FileTransfer();

        ft.onprogress = function(progressEvent) {

          if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            
            $ionicLoading.show({
              duration: 300,
              noBackdrop: true,
              template: '<p class="item-icon-left">Saving…'+perc+'%<ion-spinner icon="lines"/></p>'
            });
          } 
        };

        var imageSplit = imageURI.split(',');
        var pictureOptions = new FileUploadOptions();
            pictureOptions.fileKey = "file";
            
            pictureOptions.mimeType = $stateParams.pid+":p:"+d.getMilliseconds();
            pictureOptions.fileName = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg"

            ft.upload(imageData, SERVER.url +"/qnaRegAttach.do", function win(r){}, function win(error){}, pictureOptions);
        
        
        
      }, function (err) {
          // An error occured. Show a message to the user
      });
  };

  $scope.takeVideo = function () {
    var options = {
      limit: 1,
      duration: 50
    };

    navigator.device.capture.captureVideo(function onSuccess(mediaFiles){

      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;
      }  

      $scope.videoFullpath = path;
      $scope.videoAll = $scope.videoAll.concat($scope.videoFullpath);

      var videoURI = $scope.videoAll + "";
      var ft = new FileTransfer();
      var d = new Date();

      ft.onprogress = function(progressEvent) {

        if (progressEvent.lengthComputable) {
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
          
          $ionicLoading.show({
            duration: 300,
            noBackdrop: true,
            template: '<p class="item-icon-left">Saving…'+perc+'%<ion-spinner icon="lines"/></p>'
          });
        } 
      };

      var videoOptions = new FileUploadOptions();
          videoOptions.fileKey = "file";
          videoOptions.mimeType = $stateParams.pid+":v:"+d.getMilliseconds();
          videoOptions.fileName = d.getMilliseconds() + "_" + path;

          ft.upload(path, SERVER.url +"/qnaRegVideoAttach.do", function win(r){}, function win(error){}, videoOptions);

    },function onError(error){},options);
 };

$scope.getVideo = function () {
  var options = {
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType: 2,
    mediaType: 1
    };

    Ccamera.getPicture(options).then(function (imageData) {

      $scope.imgadd = imageData;
      $scope.videoAll = $scope.videoAll.concat($scope.imgadd);

       //동영상
      var videoURI = $scope.videoAll + "";
      var videoSplit = videoURI.split(',');
      var ft = new FileTransfer();
      var d = new Date();


      ft.onprogress = function(progressEvent) {

        if (progressEvent.lengthComputable) {
          var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);

          $ionicLoading.show({
            duration: 300,
            noBackdrop: true,
            template: '<p class="item-icon-left">Saving…'+perc+'%<ion-spinner icon="lines"/></p>'
          });
        } 
      };

      var videoOptions = new FileUploadOptions();
          videoOptions.fileKey = "file";
          videoOptions.mimeType = $stateParams.pid+":v:"+d.getMilliseconds();
          videoOptions.fileName = d.getMilliseconds() + "_" + imageData;

          ft.upload(imageData, SERVER.url +"/qnaRegVideoAttach.do", function win(r){}, function win(error){}, videoOptions);

    }, function (err) {
        // An error occured. Show a message to the user
    });
  }; 


  /*묻고답하기 수정*/  
  $scope.qnaUpdate = function(qnaView){

    var group_sn = "";
    //그룹친구일 경우에만 그룹순번을 넣어줌
    if(qnaView.open_scope == "05"){
      group_sn = document.getElementById('group_snUpdate').value;
    }

    $http.post(SERVER.url +'/qnaUpdate.do', {pid: qnaView.pid , title: qnaView.title , contents : qnaView.contents, address_pid : qnaView.address_pid , address_detail:qnaView.address_detail, expert : qnaView.expert, open_scope : qnaView.open_scope, livestock : qnaView.livestock , oie_cd : qnaView.oie_cd , select_friend_sn : $scope.select_friend_sn , group_sn : group_sn, la : $scope.la , lo : $scope.lo})
      .success(function(response){

        // 로딩중
        $ionicLoading.show({
          duration: 300,
          noBackdrop: true,
          template: '<p class="item-icon-left">Saving…<ion-spinner icon="lines"/></p>'
        });

          if(response.result.resultCode == '0000'){
            //$state.go('app.qnalist',{},{reload: true});
            $state.go('app.qnalist',"", {reload: true, inherit: false}); 
            //window.location.reload();
          }else{
            alert(response);
          } 
      });

  };


  //클릭한 사진 삭제 
  $scope.imgRemove = function(attach){

     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete',
       template: 'Would you like to delete?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          var imageArray = $scope.imgAll;
          imageArray.splice(imageArray.lastIndexOf(attach),1);
          $scope.imgAll = imageArray;

          var attc_pid = "";
          var attc_sn = "";

          for(var i =0; i < $scope.attchList.length; i++){
            if($scope.attchList[i].attc_file == attach){
              attc_pid = $scope.attchList[i].pid; 
              attc_sn = $scope.attchList[i].atchmnfl_sn;
            } 
          }

          $http.post(SERVER.url +'/attcdelete.do', {pid: attc_pid , atchmnfl_sn:attc_sn})
            .success(function(response){

            });

       } else {
         
       }
     });  
  };

  $scope.videoRemove = function(video){
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete',
       template: 'Would you like to delete?'
     });
     confirmPopup.then(function(res) {
       if(res) {
          var videoArray = $scope.videoAll;
          videoArray.splice(videoArray.lastIndexOf(video),1);
          $scope.videoAll = videoArray;

          var attc_pid = "";
          var attc_sn = "";

          for(var i =0; i < $scope.attchList2.length; i++){

            if($scope.attchList2[i].attc_file == video){
              attc_pid = $scope.attchList2[i].pid; 
              attc_sn = $scope.attchList2[i].atchmnfl_sn;
            } 
          }

          $http.post(SERVER.url +'/attcdelete.do', {pid: attc_pid , atchmnfl_sn:attc_sn})
            .success(function(response){

            });


       } else {
         
       }
     });  
  };

})
/* 묻고답하기 수정*/



/*  공지사항 리스트 */
.controller('noticelistCtrl', function($scope , $http , SERVER , $state , $ionicPopup, $localstorage, LIMIT , LASTINDEX){
  if(localStorage.getItem("token") == null || localStorage.getItem("token") == ""){
    var alertPopup = $ionicPopup.alert({
      title : 'Log in' ,
      template: 'Please log in again.'
    });

    window.location.replace("index.html");

    return false;
  }

  $scope.noticeList = {};     //공지사항 리스트


  $scope.gpid = window.localStorage.getItem('gpid');
  $scope.gid = window.localStorage.getItem('gid');
  $scope.gname = window.localStorage.getItem('gname');
  $scope.gflaguser = window.localStorage.getItem('gflaguser');

  //paging
  $scope.hasMoreData = true;

  $scope.doRefresh = function(){
    $http.post(SERVER.url +'/noticeList.do',{limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
    .success(function(response){
      $scope.noticeList = response.result;  
      $scope.hasMoreData = true;
      $scope.$broadcast('scroll.refreshComplete');
    });
/*    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });*/
  };


  $scope.loadMore = function() {
    $http.post(SERVER.url +'/noticeList.do' , {limitList:LIMIT.paging,lastIndex:$scope.noticeList.length+1})
      .success(function(response){
        $scope.noticeListadd = response.result;

        if($scope.noticeList.length === undefined){
          $http.post(SERVER.url +'/noticeList.do' , {limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
            .success(function(response){
              $scope.noticeList = response.result;  
          });
        }else{
          if(response.result != ""){            
            $scope.noticeList = $scope.noticeList.concat($scope.noticeListadd);
            $scope.hasMoreData = true;
          }else{
            $scope.hasMoreData = false;  
          }          
        }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };


  $scope.toggleGroup = function(noticeDetail) {
    if ($scope.isGroupShown(noticeDetail)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = noticeDetail;
    }
  };

  $scope.isGroupShown = function(noticeDetail) {
    return $scope.shownGroup === noticeDetail;
  };


  $scope.remove = function(noticeDetail){

   var confirmPopup = $ionicPopup.confirm({
     title: 'Delete',
     template: 'Would you like to delete?'
   });

   confirmPopup.then(function(res) {
     if(res) {
        $scope.noticeList.splice($scope.noticeList.indexOf(noticeDetail), 1);
        console.log(noticeDetail.pid);

        $http.post(SERVER.url +'/noticeDel.do', {pid: noticeDetail.pid})
          .success(function(response){

          });
     } else {
       
     }
   });
  }

  $scope.update = function(noticeDetail){
    $state.go('app.noticeupdate',{pid:noticeDetail.pid});
  }  

  $scope.regnotice = function(){
    $state.go('app.noticereg',"");
  }


})
/*  공지사항 리스트 */



/* 공지사항 등록 */
.controller('noticeRegCtrl' , function($scope , $http , $stateParams , $state , SERVER , ionPlatform, LIMIT , LASTINDEX , $ionicLoading){

  $scope.noticeReg = {};

  /*  필수값 체크 해야됨 */
  $scope.noticeValchk = function(noticeReg){

    $ionicLoading.show({
      duration: 300,
      noBackdrop: true,
      template: '<p class="item-icon-left">저장중...<ion-spinner icon="lines"/></p>'
    });

    var resultCode = "";
    $http.post(SERVER.url +'/noticeReg.do', {name:window.localStorage.getItem('gname'),title: noticeReg.title , contents : noticeReg.contents})
      .success(function(response){
        resultCode = response.result.resultCode;

        $http.post(SERVER.url + "/noticeList.do",{limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
          $scope.noticeList = response.result;
          if(response.resultCode == '0000'){
            //$state.go('app.notice',{}, {reload: true, inherit: false});
            $state.go('app.notice');
          }
        });
      })

      .finally(function(){
        $http.post(SERVER.url + "/noticePush.do",{name:window.localStorage.getItem('gname'),title: noticeReg.title , contents : noticeReg.contents})
        .success(function(response){

        });
      }); 
  };

})
/* 공지사항 등록 */


/* 공지사항 수정 */
.controller('noticeUpdateCtrl', function($scope , $http , $stateParams , SERVER , $ionicPopup , $state ,$ionicLoading){

/*  if(localStorage.getItem("token") == null || localStorage.getItem("token") == ""){
    alert("다시 로그인 해주세요");
    window.location.replace("index.html");

    return false;
  }*/

  $http.post(SERVER.url + "/noticedetail.do" , {pid: $stateParams.pid})
    .success(function(response){
      $scope.noticeView = response.result.boardResult[0];
    });

  $scope.noticeUpdate = function(noticeView){

    $http.post(SERVER.url +'/noticeUpdate.do', {pid: noticeView.pid , title: noticeView.title , contents : noticeView.contents})
      .success(function(response){
        $ionicLoading.show({
          duration: 300,
          noBackdrop: true,
          template: '<p class="item-icon-left">Saving…<ion-spinner icon="lines"/></p>'
        });        

        if(response.result.resultCode == '0000'){

          $state.go('app.notice',{},{reload: true});
          window.location.reload();
        }else{
          alert(response);
        } 
      });
  };

})

/* 공지사항 수정 */



.controller('friendlistCtrl', function($scope , $http , $stateParams , SERVER , $localstorage, $ionicPopup ,$ionicModal , $state, LIMIT , LASTINDEX , Ccamera) {

  if(localStorage.getItem("token") == null || localStorage.getItem("token") == ""){
    //alert("다시 로그인 해주세요");
    window.location.replace("index.html");

    return false;
  }

   //국가 리스트
  $http.post(SERVER.url +'/doSelectNation.do' , {})
    .success(function(response){
      $scope.nationList = response.result.result;

    }); 


  $scope.friendlist = {};
  
  //친구리스트 조회
  $http.post(SERVER.url +'/friendList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid'), friendorderValue:'0'})
    .success(function(response){
    $scope.friendlist = response.result;  
  });

  //조회버튼 클릭
  $scope.friendsearch = function(){
    var search = "";
    if($scope.fsearchValueList == "3"){
      search = $scope.searchNation;
    }else{
      search = document.getElementById('friendsearch').value;
    }
    

    $http.post(SERVER.url +'/friendList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search,friendorderValue:$scope.fOrderValueList , fsearchValue : $scope.fsearchValueList})
      .success(function(response){
      $scope.friendlist = response.result;  
    });
  };  

  //댕겨서 세로고침
  $scope.doRefresh = function(){
    var search = document.getElementById('friendsearch').value;
    $http.post(SERVER.url +'/friendList.do',{pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search , friendorderValue:$scope.fOrderValueList})
    .success(function(response){
      $scope.friendlist = response.result;  
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };


  //설정 푸시
  $scope.nPush = function(noticepush){
    var npush = "";

    if(noticepush){
      npush = "0";
    }else{
      npush = "1";
    }

    $http.post(SERVER.url +'/settingNoticePush.do' , {pid:window.localStorage.getItem('gpid') , noticePush: npush})
      .success(function(response){
        window.localStorage.setItem('gnoticepush',npush);
    });
    
  };

  //설정 푸시
  $scope.aPush = function(answerpush){
    var apush = "";

    if(answerpush){
      apush = "0";
    }else{
      apush = "1";
    }

    $http.post(SERVER.url +'/settingAnswerPush.do' , {pid:window.localStorage.getItem('gpid') , answerPush: apush})
      .success(function(response){
        window.localStorage.setItem('ganswerpush',apush);
    });
    
  };


  $scope.active = 'item1';
  // 친구 등록 설정 버튼 저어
  $scope.setActive = function(type) {
    $scope.active = type;

    var npush = window.localStorage.getItem('gnoticepush');
    var apush = window.localStorage.getItem('ganswerpush');

    if(npush === "0"){
      $scope.noticepush = true;
    }else if(npush === "1"){
      $scope.noticepush = false;
    }

    if(apush === "0"){
      $scope.answerpush = true;
    }else if(npush === "1"){
      $scope.answerpush = false;
    }  


  };

  $scope.isActive = function(type){
    return type === $scope.active;
  };

  //친구등록 화면으로 이동
  $scope.regfriend = function(){
    $state.go('app.friendreg',{}, {reload: true, inherit: false});  
  };

  //그룹 리스트 조회
  $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
    .success(function(response){
    $scope.grouplist = response.result;  
    
  });

  // 그룹 등록  
  $scope.regGroup = function(){

      $scope.modalGroup.show();
  };


  $ionicModal.fromTemplateUrl('templates/en/group.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalGroup = modal;
  });

  $scope.closeGroupModal = function() {
    $scope.modalGroup.hide();
  };

  $scope.groupAdd = function(){
    var groupAdd = document.getElementById('groupAdd').value; 

    if(groupAdd == ""){
      return false;
    }
    $http.post(SERVER.url +'/groupAddReg.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , group_nm: groupAdd})
      .success(function(response){

        document.getElementById('groupAdd').value = "";

        $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
          .success(function(response){
          $scope.grouplist = response.result;  
          
        });      
    });
  };

  $scope.groupDel = function(group_sn){
    $http.post(SERVER.url +'/groupAddDel.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , group_sn : group_sn})
      .success(function(response){
        $http.post(SERVER.url +'/groupList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid')})
          .success(function(response){
          $scope.grouplist = response.result;  
          
        });      
    });
  };


  $scope.friendReglist = {};

  $scope.friendRegsearch = function(){
    var search = document.getElementById('searchReg').value;
    
    $http.post(SERVER.url +'/friendRegList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search, friendorderValue:'0', limitList:LIMIT.paging,lastIndex:LASTINDEX.paging , fsearchValue : $scope.fsearchValueList})
      .success(function(response){
      $scope.friendReglist = response.result;  
      $scope.hasMoreData = true;      
    });
  };  


  $scope.doRegRefresh = function(){
    var search = document.getElementById('searchReg').value;
    $http.post(SERVER.url +'/friendRegList.do',{pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search , friendorderValue:'0', limitList:LIMIT.paging,lastIndex:LASTINDEX.paging , fsearchValue : $scope.fsearchValueList})
    .success(function(response){
      $scope.friendReglist = response.result;  
      $scope.hasMoreData = true;
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  //paging
  $scope.hasMoreData = true;
  $scope.loadMore = function() {
    var search = "";
    if($scope.fsearchValueList == "3"){
      search = $scope.searchNation;
    }else{
      search = document.getElementById('friendsearch').value;
    }


    $http.post(SERVER.url +'/friendRegList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search , friendorderValue:'0' , limitList:LIMIT.paging,lastIndex:$scope.friendReglist.length+1})
      .success(function(response){
        $scope.friendReglistadd = response.result;

        if($scope.friendReglist.length === undefined){
          $http.post(SERVER.url +'/friendRegList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search , friendorderValue:'0' , limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
            .success(function(response){
              $scope.friendReglist = response.result;  
          });
        }else{
          if(response.result != ""){            
            $scope.friendReglist = $scope.friendReglist.concat($scope.friendReglistadd);
            $scope.hasMoreData = true;
          }else{
            $scope.hasMoreData = false;  
          }          
        }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };  

  //친구 전문가 서택 
  $scope.friendRegExpert = function(pid,friend_sn,expert,user_id){


    $scope.fpid = window.localStorage.getItem('gpid');
    $scope.fuser_id = user_id;
    //$scope.fsn = friend_sn;
    $scope.fexpert = expert;


    if(expert === null){
      // 등록
      $scope.modal.show();
    }else{
      //해제
      $http.post(SERVER.url +'/friendDelExpert.do' , {pid:$scope.fpid , friend_sn: friend_sn , group_user_id : user_id , user_id : window.localStorage.getItem('gid')})
        .success(function(response){
          $scope.friendRegsearch();
          
      });
    }
  };


  $ionicModal.fromTemplateUrl('templates/en/expert.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.group_sn_key = "";
  $scope.group_key = function(group_key){
    // group_key 값이 999 이면 값이 없는것
    $scope.group_sn_key = group_key;
  };


  $scope.friendExpert = function(pid,fuser_id){
    var exp = document.getElementById('exp').value;

    if(exp === ""){
      exp = '0';
/*
      var alertPopup = $ionicPopup.alert({
        title : 'Friend | Expert' ,
        template: 'Please select Friend | Password.'
      });
      return false;
*/      
    }

    $http.post(SERVER.url +'/friendRegExpert.do' , {pid : pid , user_id : fuser_id , expert : exp , reg_id : window.localStorage.getItem('gid') , group_sn : $scope.group_sn_key})
      .success(function(response){
        
        $scope.friendRegsearch();      
        $scope.closeModal();
    });

  };

  $scope.fOrderValueList = "0";
  $scope.forder = "0"; 
  $scope.friendorder = function(gubun,value){
    
    // 0 : 등록일 , 1 : 닉네임
    var friendorderValue = "";

    if(value === "0"){
      friendorderValue = "0";
    }else if(value === "1"){
      friendorderValue = "1";
    }else if(value === "2"){
      friendorderValue = "2";
    }

    $scope.fOrderValueList = friendorderValue;

    if(gubun === "list"){
      var search = document.getElementById('friendsearch').value;
      $http.post(SERVER.url +'/friendList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search, friendorderValue: friendorderValue , limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.friendlist = response.result;  
      });
    }else if(gubun === "reg"){
      var search = document.getElementById('searchReg').value;
      $http.post(SERVER.url +'/friendRegList.do' , {pid:window.localStorage.getItem('gpid') , user_id: window.localStorage.getItem('gid') , nickname: search, friendorderValue: friendorderValue , limitList:LIMIT.paging,lastIndex:LASTINDEX.paging})
        .success(function(response){
        $scope.friendReglist = response.result;  
      });
    }
  };


  $scope.fsearchValueList = "0"; 
  $scope.fsearchValueChange = function(gubun,value){
    // 0 : 아이디 , 1 : 닉네임 , 2 : 이메일 , 3 : 국가 , 4 : 소속

    if(value !== "3"){
      $scope.searchNation = "1";
    }
    $scope.fsearchValueList = value;
  }

  //조회조건이 국가 일때 첫번째 국가 선택
  $scope.searchNation = "1";
  $scope.fsearchNationChange = function(value){
    $scope.searchNation = value;
  }



  $scope.friendreglist2 = function(){
    //$state.go('app.friendlist',{});
    $state.go('app.friendlist', "" , {reload: true, inherit: false});  
    //window.location.reload();
  };


  $scope.takePicture = function () {
  
    var options = {
         quality : 50,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: 1,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: 1500,
         targetHeight: 1500,
         saveToPhotoAlbum: true,
         correctOrientation:true,
         mediaType: 1
      };

      Ccamera.getPicture(options).then(function(imageData) {
        $scope.imguser = imageData;
      }, function(err) {
         console.log(err);
      });
  };
  

  $scope.getPicture = function () {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: 0,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 1500,
      targetHeight: 1500,
      correctOrientation:true,
      mediaType: 0
      };

      Ccamera.getPicture(options).then(function (imageData) {

        $scope.imguser = imageData;
        //$scope.imageall = $scope.imageall.concat($scope.imgadd);
      }, function (err) {
          // An error occured. Show a message to the user
      });
  };



  $scope.userUpdate = function(){
    var img = window.localStorage.getItem('gattc_img');
    $scope.infopid = window.localStorage.getItem('gpid');
    $scope.infouserid = window.localStorage.getItem('gid');
    $scope.infopass = window.localStorage.getItem('gpass');
    $scope.infopass2 = window.localStorage.getItem('gpass');
    $scope.infoname = window.localStorage.getItem('gname');
    $scope.infonickname = window.localStorage.getItem('gnickname');
    $scope.infoemail = window.localStorage.getItem('gemail');


    if(img.length < 5){
      $scope.imguser = "img/me.png";
    }else{
      $scope.imguser = img;
    }

    $scope.modalupdate.show();
  };

  $ionicModal.fromTemplateUrl('userupdateen.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modalupdate = modal;
  });


  $scope.usersave = function(){
    var pid = window.localStorage.getItem('gpid');
    var id = window.localStorage.getItem('gid');
    var name = window.localStorage.getItem('gname');
    var nickname = document.getElementById('nickname').value;
    var pass1 = document.getElementById('pass1').value;
    var pass2 = document.getElementById('pass2').value;
    var email = document.getElementById('email').value;

    if(nickname == "" || nickname == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Nickname',
        template: 'Please enter your nickname.'
      });            
      return false;
    }

    if(email == "" || email == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Email',
        template: 'Please enter your nickname.'
      });      
      return false;
    } 

    if(pass1 == "" || pass1 == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Please enter the password.'
      });          
      return false;
    } 

    if(pass2 == "" || pass2 == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Please confirm the password.'
      });
      return false;
    }    

    if(pass1 != pass2){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Incorrect password. Please try again.'
      });      
      return false;
    }


    if($scope.imguser != ""){
      var d = new Date();
      var ft = new FileTransfer();
      //사진
      var imageURI = $scope.imguser + "";
      var pictureOptions = new FileUploadOptions();
          pictureOptions.fileKey = "file";

      $scope.attc_user_id = d.getMilliseconds()+"_"+id+"_"+d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg";

      pictureOptions.mimeType = id+":u:"+d.getMilliseconds(); 
      pictureOptions.fileName = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg"
      ft.upload(imageURI, SERVER.url +"/userRegAttach.do", function win(r){}, function win(error){}, pictureOptions);
    }

    $http.post(SERVER.url +'/userUpdate.do', {pid:pid , id:id , name:name , nickname:nickname , pass1:pass1 , pass2:pass1 , email:email , attc_user_id:$scope.attc_user_id})
      .success(function(response){
        var alertPopup = $ionicPopup.alert({
          title : 'Modify' ,
          template: 'Modification has been made.'
        });
      
        alertPopup.then(function(res){
          window.localStorage.setItem('token',"");
          window.location.replace("index.html");
        });
    });    

  };

$scope.groupListDetail = {};
  $scope.groupView = function(){

    var pid = window.localStorage.getItem('gpid');
    var id = window.localStorage.getItem('gid');

    
    $http.post(SERVER.url +'/groupListDetail.do', {pid:pid , user_id:id})
      .success(function(response){
        $scope.groupListDetail = response.result;
    
      });

    //그룹리스트
    $http.post(SERVER.url +'/groupList.do', {pid:pid , user_id:id})
      .success(function(response){
        $scope.groupList  = response.result;
        
        $scope.groups = [];  

        var totalGroupList = $scope.groupList.length;
        var totalGroupDetail = $scope.groupListDetail.length;  

        for (var i = 0; i < totalGroupList; i++) {
          $scope.groups[i] = {
            name : $scope.groupList[i].group_nm,
            group_user_id: []
          };

          for (var j = 0; j < totalGroupDetail ; j++) {
            if ($scope.groupListDetail[j].group_sn === $scope.groupList[i].group_sn) {
              $scope.groups[i].group_user_id.push($scope.groupListDetail[j].group_user_id);
            }      
          }
        }

      });


    $scope.modalGroupview.show();
  };

  $ionicModal.fromTemplateUrl('templates/en/groupview.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modalGroupview = modal;
  });

  $scope.modalGroupviewClose = function() {
    $scope.modalGroupview.hide();
  };

  //그룹현황에서 사용자 삭제
  $scope.groupViewDel = function(value){

    var pid = window.localStorage.getItem('gpid');
    var id = window.localStorage.getItem('gid');

    $http.post(SERVER.url +'/groupDetailDel.do', {pid:pid , user_id:id , group_user_id : value})
      .success(function(response){
        
        $scope.groupView();
    });    
    
  };

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

})


/* 사이드메뉴 */
.controller('MenuCtrl', function($scope , $http , $stateParams , SERVER , $ionicPopup , $state , $ionicModal , Ccamera , $cordovaFileTransfer) {

  $scope.qnalist = function(value){
    $state.go('app.qnalist',{view:value});
    //$state.go('app.qnalist',{});
  };

  $scope.qnareg = function(){
    $state.go('app.qnareg');
  };
  
  //친구등록화면으로 이동
  $scope.friendreg = function(){
    $state.go('app.friendreg',{});
  };

  $scope.notice = function(){
    $state.go('app.notice',{});
  };

  $scope.myinfo = function(){
    var img = window.localStorage.getItem('gattc_img');

    if(img.length < 5){
      $scope.imguser = "img/me.png";
    }else{
      $scope.imguser = img;
    }    
    $scope.modal.show();  
  };

  $scope.infopid = window.localStorage.getItem('gpid');
  $scope.infouserid = window.localStorage.getItem('gid');
  $scope.infopass = window.localStorage.getItem('gpass');
  $scope.infopass2 = window.localStorage.getItem('gpass');
  $scope.infoname = window.localStorage.getItem('gname');
  $scope.infonickname = window.localStorage.getItem('gnickname');
  $scope.infoemail = window.localStorage.getItem('gemail');  

  $scope.takePicture = function () {
  
    var options = {
         quality : 50,
         destinationType: Camera.DestinationType.FILE_URI,
         sourceType: 1,
         allowEdit: false,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: 1500,
         targetHeight: 1500,
         saveToPhotoAlbum: true,
         correctOrientation:true,
         mediaType: 1
      };

      Ccamera.getPicture(options).then(function(imageData) {
        $scope.imguser = imageData;
      }, function(err) {
         console.log(err);
      });
  };
  

  $scope.getPicture = function () {
    var options = {
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: 0,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 1500,
          targetHeight: 1500,
          correctOrientation:true,
          mediaType: 0
      };

      Ccamera.getPicture(options).then(function (imageData) {

        $scope.imguser = imageData;
        //$scope.imageall = $scope.imageall.concat($scope.imgadd);
      }, function (err) {
          // An error occured. Show a message to the user
      });
  };


  $ionicModal.fromTemplateUrl('templates/en/myinfo.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('userupdateen.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    $scope.modalupdate = modal;
  });

  $scope.usersave = function(){
    var pid = window.localStorage.getItem('gpid');
    var id = window.localStorage.getItem('gid');
    var name = window.localStorage.getItem('gname');
    var nickname = document.getElementById('nickname').value;
    var pass1 = document.getElementById('pass1').value;
    var pass2 = document.getElementById('pass2').value;
    var email = document.getElementById('email').value;

    if(nickname == "" || nickname == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Nickname',
        template: 'Please enter your nickname.'
      });            
      return false;
    }

    if(email == "" || email == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Email',
        template: 'Please enter your email.'
      });      
      return false;
    } 

    if(pass1 == "" || pass1 == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Please enter the password.'
      });          
      return false;
    } 

    if(pass2 == "" || pass2 == null){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Please confirm the password.'
      });
      return false;
    }    

    if(pass1 != pass2){
      var alertPopup = $ionicPopup.alert({
        title: 'Password',
        template: 'Incorrect password. Please try again.'
      });      
      return false;
    }


    if($scope.imguser != ""){
      var d = new Date();
      var ft = new FileTransfer();
      //사진
      var imageURI = $scope.imguser + "";
      var pictureOptions = new FileUploadOptions();
          pictureOptions.fileKey = "file";
          
      $scope.attc_user_id = d.getMilliseconds()+"_"+id+"_"+d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg";

      pictureOptions.mimeType = id+":u:"+d.getMilliseconds(); 
      pictureOptions.fileName = d.getFullYear()+""+d.getMonth()+""+d.getDate()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds() + ".jpg"
      ft.upload(imageURI, SERVER.url +"/userRegAttach.do", function win(r){}, function win(error){}, pictureOptions);
    }

    $http.post(SERVER.url +'/userUpdate.do', {pid:pid , id:id , name:name , nickname:nickname , pass1:pass1 , pass2:pass1 , email:email , attc_user_id:$scope.attc_user_id})
      .success(function(response){
        var alertPopup = $ionicPopup.alert({
          title : 'Modify' ,
          template: 'Modification has been made.'
        });
        
        alertPopup.then(function(res){
          window.localStorage.setItem('token',"");
          window.location.replace("index.html");
        });
    });    

  };

  //개인정보 수정
  $scope.userUpdate = function(){
    var img = window.localStorage.getItem('gattc_img');

    if(img.length < 5){
      $scope.imguser = "img/me.png";
    }else{
      $scope.imguser = img;
    }

    $scope.modalupdate.show();
  };


  $scope.groups = [];
  for (var i=0; i<10; i++) {
    $scope.groups[i] = {
      name: i,
      items: []
    };
    for (var j=0; j<3; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  $scope.isGroupShownNotice = function(group) {
    return $scope.shownGroupNotice === group;
  };

  $scope.toggleGroup2 = function(group) {
    if ($scope.isGroupShown2(group)) {
      $scope.shownGroup2 = null;
    } else {
      $scope.shownGroup2 = group;
    }
  };

  $scope.isGroupShown2 = function(group) {
    return $scope.shownGroup2 === group;
  };

  //로그아웃
  $scope.logout = function(){
    window.localStorage.setItem('token',"");
    window.location.replace("index.html");
  };

  //회원 탈퇴
  $scope.regout = function(){

     var confirmPopup = $ionicPopup.confirm({
       title: 'Cancelation',
       template: 'Would you like to cancel?'
     });
     confirmPopup.then(function(res) {
       if(res) {
        $http.post(SERVER.url + "/regout.do" , {pid:window.localStorage.getItem('gpid') , id:window.localStorage.getItem('gid')})
          .success(function(response){
            var alertPopup = $ionicPopup.alert({
              title : 'Cancel membership' ,
              template: 'The cancelation you requested has been made. '
            });

            alertPopup.then(function(res){
              window.localStorage.setItem('token',"");
              window.location.replace("index.html");
            });
          });          
       } else {
         
       }
     });
  };

})
/* 사이드메뉴 */




;

