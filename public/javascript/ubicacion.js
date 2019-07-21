let respuesta
let mainMap
let rutaIsOn = true
let divMapa = document.getElementById('Mapa')
navigator.geolocation.getCurrentPosition(fnOk, fnFail)
let ruta, startBtn, destBtn, container, markerInicial, markerFinal, popPup, coordenadasAux = [],
    animatedCar, iconCar, iconCarEnd, iconCarStop, viaje, ultimo, idViaje
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function fnOk(resp) {
    console.log(resp)
    cargarMapa(resp.coords.latitude, resp.coords.longitude)
}

function fnFail() {
    cargarMapa(10.988119017649746, -74.78959575136814)
}

function notificar() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {
        var notificacion = new Notification("Recorrido finalizado", {
            icon: "./Imagenes/carblue.png",
            body: " Por favor presione aqui mas información"
        });

        notificacion.onclick = function() {

        }
    }
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
    let contHtml = `<Button onclick="onMarkers(this)" class="btn-map-start">Comenzar en esta ubicación</Button>
    <Button onclick="deleteMarkers(this)" class="btn-map-end">Finalizar en esta ubicación</Button>`
    popPup = L.popup()
        .setContent(contHtml)
        .setLatLng(e.latlng)
        .openOn(mainMap)
}

function onMarkers(id) {
    console.log(`funciona ${id}`)
    ruta.spliceWaypoints(0, 1, popPup.getLatLng());
    mainMap.closePopup();
    console.log(ruta)
        //asignarValoresAuxiliar()
}

function deleteMarkers(id) {
    console.log(`funciona ${id}`)
    ruta.spliceWaypoints(ruta.getWaypoints().length - 1, 1, popPup.getLatLng());
    mainMap.closePopup();
    console.log(ruta)
        //console.log(ruta._line._route.coordinates)
        // asignarValoresAuxiliar()
}

function UtilizarRuta() {
    if (rutaIsOn) {
        rutaIsOn = false
        console.log(ruta._line._route.coordinates)
        iconCar = L.icon({
            iconUrl: './Imagenes/caryellow.png',
            iconSize: [20, 20]
        });
        iconCarEnd = L.icon({
            iconUrl: './Imagenes/carblue.png',
            iconSize: [20, 20]
        });
        iconCarStop = L.icon({
            iconUrl: './Imagenes/carred.png',
            iconSize: [20, 20]
        });
        animatedCar = L.animatedMarker(ruta._selectedRoute.coordinates, {
            distance: 350,
            interval: 4500,
            icon: iconCar,
            onEnd: function() {
                animatedCar.setIcon(iconCarEnd)
                viaje.end = true
                db.collection("Viajes").doc(idViaje).update({ end: true })
                rutaIsOn = true
                notificar()
            }
        })
        mainMap.addLayer(animatedCar)
        ultimo = ruta._selectedRoute.waypoints.length - 1
        viaje = {
            geoPosInicial: ruta._selectedRoute.waypoints[0].latLng,
            geoPosFinal: ruta._selectedRoute.waypoints[ultimo].latLng,
            geoPosActual: animatedCar._latlng,
            posInicial: ruta._selectedRoute.waypoints[0].name,
            posFinal: ruta._selectedRoute.waypoints[ultimo].name,
            tiempo: ruta._selectedRoute.summary.totalTime,
            distancia: ruta._selectedRoute.summary.totalDistance,
            end: false,
            stoped: false
        }
        agregarDatos(viaje.geoPosInicial, viaje.geoPosFinal, viaje.geoPosActual, viaje.posInicial, viaje.posFinal, viaje.tiempo, viaje.distancia, viaje.end, viaje.stoped)
        animatedCar.on('move', movimientoCarro)
    }
}

function DetenerRuta() {
    animatedCar.stop()
    console.log(`car stoped`)
    animatedCar.setIcon(iconCarStop)
    db.collection("Viajes").doc(idViaje).update({ stoped: true })
}

function movimientoCarro(e) {
    //console.log(`Latidud: ${e.latlng.lat}, Longitud: ${e.latlng.lat}`)
    db.collection("Viajes").doc(idViaje).update({
        geoPosicionActual: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        }
    })
}