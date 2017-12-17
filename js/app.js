var map;

var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 43.706758, lng: -79.398322},
    zoom: 11,
    mapTypeControl: false
  });
};
