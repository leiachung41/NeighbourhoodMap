var locationList = [
  {name: 'Meow Cat Cafe', location: {lat: 43.702967, lng: -79.388328}},
  {name: 'Casa Loma', location: {lat: 43.678066, lng: -79.409426}},
  {name: 'IKEA Etobicoke', location: {lat:  43.61864, lng: -79.534625}},
  {name: 'Rooster Coffee House', location: {lat: 43.669105, lng: -79.352863}},
  {name: 'TIFF Bell Lightbox', location: {lat:  43.646622, lng: -79.390332}}
];

var Location = function (item) {
  this.name = ko.observable(item.name);
  this.location = ko.observable(item.location);
  this.marker = ko.observable();
};

var map;

var initMap = function() {
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 43.677871, lng: -79.443047},
    zoom: 12,
    styles: styles,
    mapTypeControl: false
  });

  ko.applyBindings(new viewModel());
};

var googlemapError = function() {
  $('#map').append('<h3>SORRY. Could not Load. Refresh again, please.</h3>');
}

var viewModel = function() {
  var self = this;

  this.locations = ko.observableArray ();

  locationList.forEach(function (item) {
    var location = new Location (item);

    var marker = new google.maps.Marker({
      position: item.location,
      map: map,
      name: item.name
    });

    marker.addListener('click', function (){
      self.openInfoWindow(this);
    });

    location.marker = marker;

    self.locations.push(location);

  });

  var infoWindow = new google.maps.InfoWindow({});

  this.openInfoWindow = function (marker) {

    var forsquareRequestTimeOut = setTimeout(function () {
      infoWindow.setContent("<h4> SORRY. Could not Load. Refresh again, please.</h4>");
      infoWindow.open(map, marker);
    },10000);

    $.ajax({
      url: 'https://api.foursquare.com/v2/venues/explore',
      type: 'GET',
      dataType: 'json',

      data: {
        client_id: '1IWMXUIXTP41LS222SE03WYUA5UV2J5UJ24JOYOYZWGIQRDQ',
        client_secret: 'O0YNHGTZBKPFJK3LLGCIQ3EEZ4LJRWPHUKMQCH4DGQLOXWFK',
        v: '20170801',

        limit: 1,
        ll: marker.position.lat() + ',' + marker.position.lng(),
        query: marker.name,
        async: true
      },

      success: function(results) {
        infoWindow.open(map, marker);
        infoWindow.setContent(
          '<div class="infowindow"><h2><span>' + marker.name + '</span></h2>' +
          '<ul><li class="info-li">Rating: ' + results.response.groups[0].items[0].venue.rating + '</li>' +
          '<li class="info-li">Phone: ' + results.response.groups[0].items[0].venue.contact.formattedPhone + '</li>' +
          '<li class="info-li">Address: ' + results.response.groups[0].items[0].venue.location.address + '</li>' +
          '<li class="info-li">URL: <a href=' + results.response.groups[0].items[0].venue.url + '>' +
          results.response.groups[0].items[0].venue.url + '</a></ul></div>');
          clearTimeout(forsquareRequestTimeOut);
        }
    });

    marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function () {
       marker.setAnimation(null);
      },1000);
  };

  this.places = ko.observableArray(self.locations());
  this.userInput = ko.observable('');

  this.filteredList = ko.computed (function () {
    return ko.utils.arrayFilter(self.places(), function(loc) {
      var filter = self.userInput().toLowerCase();

      if (loc.name().toLowerCase().indexOf(filter) >= 0) {
        loc.marker.setVisible(true);
        return true;
      } else {
        loc.marker.setVisible(false);
        return false;
      }
    });
  });

  this.locationClicked = function (loc) {
    self.openInfoWindow(loc.marker);
  };

};

var styles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
];
