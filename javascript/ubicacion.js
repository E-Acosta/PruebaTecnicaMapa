let respuesta
let mainMap
let divMapa = document.getElementById('Mapa')
navigator.geolocation.getCurrentPosition(fnOk, fnFail)
let popInicial = L.popup();
let markerInicial = L.marker();
let popFinal = L.popup();
let markerFinal = L.marker();

function fnOk(resp) {
    console.log(resp)
    let html = `lat = ${resp.coords.latitude}, long= ${resp.coords.longitude}`
        //divMapa.innerHTML = html
    respuesta = resp
    cargarMapa(resp.coords.latitude, resp.coords.longitude)
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
    /*L.marker([lat, lon]).addTo(mainMap);
    L.Routing.control({
        waypoints: [
            L.latLng(10.844671, -74.770512),
            L.latLng(10.861098, -74.783247)
        ]
    }).addTo(mainMap);*/

}

function onMarkers(id) {
    mainMap.on('click', onMapClick);
}

function offMarkers(id) {
    mainMap.off('click', onMapClick);
}

function onMapClick(e) {
    console.log(e)
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mainMap)
}

function fnFail() {
    console.log(`No se pudo obtener la ubicacion`)
}