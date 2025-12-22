mapboxgl.accessToken = mapToken;
try {
    console.log('map.js init', { hasMapToken: !!mapToken, listing });
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11',
        center: listing && listing.geometry && listing.geometry.coordinates ? listing.geometry.coordinates : [0, 0], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4><p>${listing.location}, ${listing.country}</p>`
    );

    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(listing.geometry.coordinates) // Marker position [lng, lat]
        .setPopup(popup)
        .addTo(map);

    console.log('map initialized', { center: map.getCenter().toArray(), markerLngLat: marker.getLngLat() });
} catch (err) {
    console.error('map.js error:', err);
}
