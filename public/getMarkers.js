let points = [];

function getMarkers() {
  points = [];
  function marketsCallback(results, status, pagination) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i += 1) {
        const p = {
          location: {
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng(),
          },
          name: results[i].name,
          photos: [],
        };

        points.push(p);
        if (results[i].photos) {
          results[i].photos.forEach((pho) => p.photos.push(pho.getUrl({ maxWidth: 600, maxHeight: 400 })));
        } else {
          p.photos.push('/images/pokestopnoimg.jpg');
        }
        createMarker(p, '/images/pokestop.png');
      }

      if (pagination.hasNextPage) {
        pagination.nextPage();
      }
    }
  }

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: bsas,
    radius: 5000,
    type: ['store', 'political', 'locality', 'restaurant', 'lodging'],
  }, marketsCallback);
}

function sendMarkers() {
  const npoints = [];
  points.forEach((p) => {
    npoints.push({
      location: {
        type: 'Point',
        coordinates: [parseFloat(p.location.lng), parseFloat(p.location.lat)],
      },
      name: p.name,
      photos: p.photos,
      type: 'pokestop',
    });
  });

  $.ajax({
    type: 'POST',
    url: '/savemarkers',
    data: { points: npoints },
    success: () => console.log('saved.'),
    dataType: 'json',
  });
}
