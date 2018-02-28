angular.module('starter.services',[])

//localStorage사용을 위하 세팅
.factory('$localstorage',['$window',function($window){
	return{
		set: function(key , value){
			$window.localStorage[key] = value;
		},
		get: function(key , defaultValue){
			return $window.localstorage[key] || defaultValue;
		},
		setObject: function(key , value){
			$window.localstorage[key] = JSON.stringify(value);
		},
		getObject: function(key){
			return JSON.parse($window.localstorage[key] || '{}');
		}
	}
}])

.factory('Ccamera', function($q) {

   return {
      getPicture: function(options) {
         var q = $q.defer();

         navigator.camera.getPicture(function(result) {
            q.resolve(result);
         }, function(err) {
            q.reject(err);
         }, options);

         return q.promise;
      }
   }

})

.factory(("ionPlatform"), function( $q ){
    var ready = $q.defer();

    ionic.Platform.ready(function( device ){
        ready.resolve( device );
    });

    return {
        ready: ready.promise
    }
})

;
