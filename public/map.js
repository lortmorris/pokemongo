const bsas = {
  lat: -34.595129,
  lng: -58.444244,
};

let map = null;
let infowindow = null;


var currentMarkers = [];
var ashMarker = null;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: bsas,
    zoom: 13,
  });

  ashMarker = new google.maps.Marker({
    map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: bsas,
    icon: '/images/ash.png',
  });

  ashMarker.addListener('click', (event) => {
    if (ashMarker.getAnimation() !== null) {
      ashMarker.setAnimation(null);
    } else {
      ashMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
  });

  ashMarker.addListener('dragend', (event) => {
    clearMarkers();
    getPoints(event.latLng.lng(), event.latLng.lat(), 100, 'all');
  });

  setInterval(() => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
          lng: position.coords.longitude,
          lat: position.coords.latitude,
        };
        ashMarker.setPosition(new google.maps.LatLng(coords.lat, coords.lng));
        getPoints(coords.lng, coords.lat, 100, 'all');
      });
    } catch (e) {
      console.log('without position');
    }
  }, 1000);
}

function getPoints(long, lat, distance, type) {
  if (long === 0) long = bsas.lng;
  if (lat === 0) lat = bsas.lat;
  if (distance === 0) distance = 1000000000;

  $.ajax({
    type: 'POST',
    url: '/getpoints',
    data: {
      query: {
        long,
        lat,
        distance,
        type,
      },
    },
    success: (data) => {
      data.forEach((p) => {
        p.location.lng = p.location.coordinates[0];
        p.location.lat = p.location.coordinates[1];
        let icon = '/images/pokestop.png';
        if (p.type === 'pokemon') {
          p.photos[0] = `/images/pokemons/${p.photos[0]}`;
          icon = p.photos[0];
        }
        createMarker(p, icon);
      });
    },
    dataType: 'json',
  });
}

function clearMarkers() {
  currentMarkers.forEach((m) => m.setMap(null));
  currentMarkers = [];
}

function createMarker(item, icon) {
  const marker = new google.maps.Marker({
    map,
    position: item.location,
    title: item.name,
    icon,
  });

  currentMarkers.push(marker);
  const contentString = `
  <div id="content">
    <div id="siteNotice" />
    <h1 id="firstHeading" class="firstHeading">${item.name}</h1>
    <div id="bodyContent">
      <img src="${item.photos[0]}" />
    </div>
  </div>
  `;

  const infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  google.maps.event.addListener(marker, 'click', () => {
    infowindow.setContent(contentString);
    infowindow.open(map, this);
  });
}
