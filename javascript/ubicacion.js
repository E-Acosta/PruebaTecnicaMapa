let respuesta
let divMapa = document.getElementById('Mapa')
navigator.geolocation.getCurrentPosition(fnOk, fnFail)
let inicio

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
    let mapita = L.map('mimapa').setView([lat, lon], 14)
    L.tileLayer(openstreet, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZXZlcmFjb3N0YSIsImEiOiJjanlhanEyOHgwY3BsM25xaW8xNTdjMnM2In0.Gan5URMAJsNmNOJQk2wDWw'
    }).addTo(mapita);
    L.marker([lat, lon]).addTo(mapita);
    L.Routing.control({
        waypoints: [
            L.latLng(10.844671, -74.770512),
            L.latLng(10.861098, -74.783247)
        ]
    }).addTo(mapita);
}

function fnFail() {
    console.log(`No se pudo obtener la ubicacion`)
}