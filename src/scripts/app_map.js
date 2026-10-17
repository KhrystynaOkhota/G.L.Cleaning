jQuery(function ($) {

  // Перехоплення попередження про deprecated (за бажанням)
  const originalWarn = console.warn;
  console.warn = function (...args) {
    if (typeof args[0] === 'string' && args[0].includes('google.maps.Marker is deprecated')) {
      return;
    }
    originalWarn.apply(console, args);
  };

  function initializeMap() {
    var element = document.getElementById('map');
    if (!element) return;

    var options = {
      zoom: 15,
      center: { lat: 50.47253296158417, lng: 30.443476447314264 },
      gestureHandling: 'greedy',
      styles: [
        { "elementType": "geometry", "stylers": [{ "color": "#F4F4F4" }] },
        { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#F4F4F4" }] },
        { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#dddee2" }] },
        { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ccd4db" }] },
        { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#ccd4db" }] },
        { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
        { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#cad2d8" }] },
        { "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
        { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] }
      ]
    };

    var myMap = new google.maps.Map(element, options);

    var markers = [{
      coordinates: { lat: 50.47253296158417, lng: 30.443476447314264 },
      image: "assets/img/pin.png",
      info: "<div class='map-info'><h4>test</h4><div>test</div><a href='tel:354678'>346577ijhgfv</a></div>"
    }];

    function addMarker(properties) {
      var marker = new google.maps.Marker({
        position: properties.coordinates,
        map: myMap,
        icon: properties.image || null
      });

      if (properties.info) {
        var infoWindow = new google.maps.InfoWindow({ content: properties.info });
        marker.addListener('click', function () {
          infoWindow.open(myMap, marker);
        });
      }
    }

    for (var i = 0; i < markers.length; i++) {
      addMarker(markers[i]);
    }
  }

  // Надійна перевірка готовності API (вирішує проблему при перезавантаженні)
  function infoGoogleMapsReady() {
    return new Promise(function (resolve) {
      const checkReady = setInterval(function () {
        if (typeof google !== 'undefined' && typeof google.maps !== 'undefined' && typeof google.maps.Map === 'function') {
          clearInterval(checkReady);
          resolve();
        }
      }, 50);
    });
  }

  infoGoogleMapsReady().then(initializeMap);

});