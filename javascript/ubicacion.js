let respuesta
let mainMap
let divMapa = document.getElementById('Mapa')
navigator.geolocation.getCurrentPosition(fnOk, fnFail)
let markerInicial
let markerFinal
let contador = 0
let ruta

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
     */

}

function trazarRuta(markerInicial, markerFinal) {
    ruta = L.Routing.control({
        waypoints: [
            L.latLng(markerInicial._latlng.lat, markerInicial._latlng.lng),
            L.latLng(markerFinal._latlng.lat, markerFinal._latlng.lng)
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim()
    })
    ruta.addTo(mainMap)
    console.log(ruta)
    markerInicial.remove()
    markerFinal.remove()
}

function onMarkers() {
    mainMap.on('click', onMapClick)
}

function deleteMarkers() {
    if (contador > 0 && contador <= 2) {
        markerInicial.remove()
        markerFinal.remove()
        ruta.remove()
        contador = 0
    }
}

function onMapClick(e) {
    console.log(e)

    switch (contador) {
        case 0:
            contador += 1
            markerInicial = L.marker([e.latlng.lat, e.latlng.lng])
            markerInicial.bindPopup(`Ubicacion Inicial: \nLatitud:${e.latlng.lat},\nLongitud: ${e.latlng.lng}`)
            markerInicial.addTo(mainMap)
            markerInicial.openPopup()
            console.log(markerInicial)
            break;
        case 1:
            contador += 1
            markerFinal = L.marker([e.latlng.lat, e.latlng.lng])
            markerFinal.bindPopup(`Ubicacion Final: \nLatitud:${e.latlng.lat},\nLongitud: ${e.latlng.lng}`)
            markerFinal.addTo(mainMap)
            markerFinal.openPopup()
            console.log(markerFinal)
            trazarRuta(markerInicial, markerFinal)
            break;
        default:
            mainMap.off('click', onMapClick)
    }
}

function fnFail() {
    console.log(`No se pudo obtener la ubicacion`)
}