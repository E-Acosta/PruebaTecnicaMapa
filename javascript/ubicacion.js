let respuesta
let mainMap
let divMapa = document.getElementById('Mapa')
navigator.geolocation.getCurrentPosition(fnOk, fnFail)
let ruta
let startBtn
let destBtn
let container
let markerInicial
let markerFinal
let popPup

function fnOk(resp) {
    console.log(resp)
    cargarMapa(resp.coords.latitude, resp.coords.longitude)
}

function fnFail() {
    cargarMapa(10.988119017649746, -74.78959575136814)
}

function cargarMapa(lat, lon) {
    mapbox = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZXZlcmFjb3N0YSIsImEiOiJjanlhanEyOHgwY3BsM25xaW8xNTdjMnM2In0.Gan5URMAJsNmNOJQk2wDWw'
    openstreet = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    mainMap = L.map('mimapa').setView([lat, lon], 14)
    L.tileLayer(openstreet, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZXZlcmFjb3N0YSIsImEiOiJjanlhanEyOHgwY3BsM25xaW8xNTdjMnM2In0.Gan5URMAJsNmNOJQk2wDWw'
    }).addTo(mainMap);
    iniciarRouter()
}

function iniciarRouter() {
    ruta = L.Routing.control({
        waypoints: [
            L.latLng(null, null),
            L.latLng(null, null)
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim()
    })
    ruta.addTo(mainMap)
    console.log(ruta)
    mainMap.on('click', onMapClick)
}

function onMapClick(e) {
    let contHtml = `<Button onclick="onMarkers(this)">Comenzar en esta ubicación</Button>
    <Button onclick="deleteMarkers(this)">Finalizar en esta ubicación</Button>`
    popPup = L.popup()
        .setContent(contHtml)
        .setLatLng(e.latlng)
        .openOn(mainMap)
}

function onMarkers(id) {
    console.log(`funciona ${id}`)
    ruta.spliceWaypoints(0, 1, popPup.getLatLng());
    mainMap.closePopup();
}

function deleteMarkers(id) {
    console.log(`funciona ${id}`)
    ruta.spliceWaypoints(ruta.getWaypoints().length - 1, 1, popPup.getLatLng());
    mainMap.closePopup();
}