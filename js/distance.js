 function fomatFloat(src,pos){     
    return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);     
}  
function toRadians(degree){
	return degree * Math.PI / 180 ;
}

function distance(latitude1,longitude1,latitude2,longitude2){
	//R是地球的半径，以km为单位
	var R = 6371;
	var deltaLatitude = toRadians(latitude2 - latitude1);
	var deltaLongitude = toRadians(longitude2 - longitude1);
	  
	latitude1 = toRadians(latitude1);
	latitude2 = toRadians(latitude2);
	  
	var a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2);
	var c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
	var d = R * c;
	if(d > 0.5){
		d = fomatFloat(d, 2) + "km";
	} else {
		d = Math.round(d*1000) + "m";
	}
	return d;
}
var latitude = "";
var longitude = "";
function updateLocation(position){
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
        $("#coordinate").attr({"href":"?latitude="+latitude+"&longitude="+longitude});
		$(".dis").each(function(){
			var d = 0;
			var that = $(this);
			var lat = that.attr("data-lat"),
				lng = that.attr("data-lng");
				
			//if(navigator.geolocation){
					//navigator.geolocation.getCurrentPosition(function (p) {
						d = distance(latitude,longitude,lat,lng);
						that.text(d);
						
					//}, handleLocationError
				//);
			//}

		});
}
  
function handleLocationError(error) {
	switch(error.code)
	{
	case 0:
	  //updateStatus("检索位置发生错误：" + error.message);
	  break;
	case 1:
	 // updateStatus("用户阻止检索位置信息。");
	  break;
	case 2:
	 // updateStatus("浏览器不能检索位置信息：" + error.message);
	  break;
	case 3:
	 // updateStatus("浏览器检索位置信息超时。");
	  break;
	}
}
Zepto(function($){
	navigator.geolocation.watchPosition(updateLocation,handleLocationError,{maximumAge:20000,frequency: 3000});

    $("#coordinate").on("click",function(e){
        e.preventDefault();
        e.stopPropagation();
        if( latitude === "" &&  longitude ===""){
            alert("浏览器定位未开或者该浏览器不支持定位！");
        }else{
            window.location.href="?latitude="+latitude+"&longitude="+longitude;
        }
    })

});


