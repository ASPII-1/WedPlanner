maptilersdk.config.apiKey = maptilerApiKey;
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: wedground.geometry.coordinates, 
    zoom:7
});

new maptilersdk.Marker()
    .setLngLat(wedground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${wedground.title}</h3><p>${wedground.location}</p>`
            )
    )
    .addTo(map)