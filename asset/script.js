var map ; var start_destination , end_destination;
    var start_autocomplete , end_autocomplete;
    var start_latlng, end_latlng;
    var directionsDisplay ,directionsService, placeService;
    var markerIcon ='';
    
    function mapResize(mapElement) {
            mapElement.style.width = window.innerWidth+'px';
            mapElement.style.height = window.innerHeight+'px';
    }
    
    function initMap() {
        
        var mapdiv = document.getElementById("map");
        mapResize(mapdiv) ;
        
        var mapContent = document.getElementById('map');
	map = new google.maps.Map(mapContent, {
	 zoom: 12,
	 center: {lat: 41.85, lng: -87.65}
       });
	
	// for traffic view 
	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);
       /////////
       
       // set marker on client current location
      //
      //
      //// set location autocomplete
      placeAutocomplete();
      /////////
      //
      //// route direction on graph mode
      //directionsService = new google.maps.DirectionsService;
      //directionsDisplay = new google.maps.DirectionsRenderer;
      /////
      //
      //// route direction on text mode
      //directionsDisplay.setMap(map);
      //directionsDisplay.setPanel(document.getElementById('directions-panel'));
      /////
      //
      //

            

    }
    var markerList = [];
    function nearbyPlace(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK && results.length>0) {
	   var mainStr ='';
	   mainStr += '<ul>';
	   $.each(results,function(index,element){
	    var str ="";
	      mainStr += '<li class="col-lg-12"><a href="javascript:void(0)" data-lat="'+element.geometry.location.G+'" data-lng="'+element.geometry.location.K+'">';
	      mainStr += '<div class="col-lg-3"><img src="'+element.icon+'" align="left"/></div>';
	      mainStr += '<div class="col-lg-9">'
	      mainStr += '<span class="locName">'+element.name+'</span><br/>';
	      mainStr += '<span class="locAddress">'+element.formatted_address+'</span><br/>';
	      mainStr += '</div>';
	      mainStr += '</a></li>';
	      
	      
	      var infostr ="";
	      infostr += '<div class="col-lg-12 infoBoxContent">';
	      //infostr += '<div class="col-lg-1 imgContent"><img src="'+element.icon+'" align="left"/></div>';
	      infostr += '<div class="col-lg-12">';
	      infostr += '<span class="locName">'+element.name+'</span><br/>';
	      infostr += '<span class="locAddress">'+element.formatted_address+'</span><br/>';
	      infostr += '</div>';
	      infostr += '</div>';
	      //console.log(element.geometry.location.lat()+"<>"+element.geometry.location.lng());
	    var markerLatLng = new google.maps.LatLng(element.geometry.location.lat() , element.geometry.location.lng());
	    var marker = new google.maps.Marker({
	      position: markerLatLng,
	      map: map,
	      title: element.name,
	      zIndex: index
	      });
	    
	    var infowindow = new google.maps.InfoWindow({
		content: infostr,
		maxWidth: 200
	      });
	    marker.addListener('click', function() {
		infowindow.open(map, marker);
	      });

  
	    if (markerIcon!='') {
		marker.setIcon('asset/'+markerIcon);
	    }
	    map.setCenter(markerLatLng);
	   });
	   
	   mainStr +="</ul>";
	   $('#nearby-loc').html(mainStr);
	   
	   
	}
    }
    
    function RouteDisplay(directionsService,directionsDisplay){
	travelMode = $('input[name=route_type]:checked').val();
	directionsService.route({
	    origin 		: start_latlng,
	    destination 	: end_latlng,
	    travelMode: google.maps.TravelMode[travelMode]

	}, function(response, status) {
	    
	    if (status == google.maps.DirectionsStatus.OK) {
	      directionsDisplay.setDirections(response);
	      $(".getDirection").show();
	    } else {
	      window.alert('Directions request failed due to ' + status);
	    }
	  });
    }
    
    
    
    function searchNearbyLocation(element){
	markerIcon = $(element).attr('data-marker');
	if (navigator.geolocation) {
	 navigator.geolocation.getCurrentPosition(function(position) {
	   var pos = {
	     lat: position.coords.latitude,
	     lng: position.coords.longitude
	   };
       console.log(pos);
	   var myLatLng = new google.maps.LatLng(pos.lat,pos.lng);
	   var request = {
	    location: myLatLng,
	    radius: '1000',
	    query: $(".loc_type:checked").val()
	  };
    
	  placeService = new google.maps.places.PlacesService(map);
	  placeService.textSearch(request, nearbyPlace);
	  
	  
	  
	 });
      }
    }
    
    function showNearbyLoc(){
	if($(".nearby-location-type:visible").length==0 && $("#nearByLocationsType").html()==''){
		$.ajax({
		    url: 'asset/location_type.json',
		    success: function(msg){
			var data = msg;var str = '';
			$.each(data,function(index,element){
			    var marker_icon = ''; 
			    if (element.icon != undefined ) {
				marker_icon = element.icon;
			    }
			    
			   str += '<div class="col-lg-6"><input type="radio" data-marker="'+marker_icon+'" name="type_of_loc" class="loc_type" onclick="searchNearbyLocation(this)" value="'+index+'"/>'+element.name+'</div>';
			});
			$("#nearByLocationsType").html(str);
			
		    }
		})
	}
	$(".nearby-location-type").slideToggle('slow');

    }
    
    function placeAutocomplete() {
            start_destination 	= document.getElementById('start_destination');
            start_autocomplete 	= new google.maps.places.Autocomplete(start_destination);
            
            start_autocomplete.addListener('place_changed', function() {
                
            var place = start_autocomplete.getPlace();
            console.log(place);
              if (place.geometry) {
                
                 
                 var pos = place.geometry.location;
                 //console.log(pos);
                 start_latlng = new google.maps.LatLng(pos.lat(),pos.lng());
                 map.setCenter(start_latlng);
                 var marker = new google.maps.Marker({
                  position: start_latlng,
                  map: map,
                  title: place.name,
                  zIndex: 20,
                  icon: place.icon
                  });
                 
                 $(".location-details-content #location-name").html(place.name);
                 $(".location-details-content #location-address span").text(place.formatted_address);
                 $(".location-details-content #location-phone span").text(place.international_phone_number);
                
                 //$(".location-details-content #location-rate .rateit").attr('data-rateit-value',place.rating);
                 $('.location-details-content #location-rate .rateit').rateit({value:place.rating });
                 $(".location-details-content").addClass('show');
                 $(".location-details-content").removeClass('hide');
                 //$(".nav-icon").trigger('click');
                 //document.getElementById("start_direction_lat_lng").value = pos.G=','+pos.K;
              }
            });
          

    }
    function searchRoute(){
	RouteDisplay(directionsService,directionsDisplay);
    $(".nav-icon").trigger('click');
    }
    function showDirection() {
	 
	 $(".directionContainer").slideToggle();
    }
  /* */ 
    
    $(function(){
      $(".nav-icon").click(function(){
        if ($(".nav-container").width() > 0) {
            $(".nav-container").animate({width: 0},300);
        }else{
            $(".nav-container").animate({width: $(".main-container").width()},300);
        }
        
      });
      $("#knowDirection").click(function(){
        if ($(".to-direction").hasClass('hide')) {
            $(".to-direction").removeClass('hide');
            $(".to-direction").addClass('show');
        }else{
            $(".to-direction").removeClass('show');
            $(".to-direction").addClass('hide');
        }
      });
    })