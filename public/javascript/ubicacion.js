let respuesta
let mainMap
let rutaIsOn = true
let divMapa = document.getElementById('Mapa')
navigator.geolocation.getCurrentPosition((fnOk), fnFail) //funcion asincrona para pedir la ubicacion del usuario e inicializar el mapa
let ruta, startBtn, destBtn, container, markerInicial, markerFinal, popPup, coordenadasAux = [],
    animatedCar, iconCar, iconCarEnd, iconCarStop, viaje, ultimo, idViaje
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function fnOk(resp) { //funcion que se ejecuta en caso de que el usuario acepte el acceso a su ubicacion
    console.log(resp)
    cargarMapa(resp.coords.latitude, resp.coords.longitude)
}

function fnFail() { //Si dado el caso el usuario no acepta entonces el mapa se inicializa 
    cargarMapa(10.988119017649746, -74.78959575136814) //con las coordenadas de una posicion mas o menos central en barranquilla
}
//Envio de notificacion de escritorio con "Notification"
function notificar() {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    } else {
        var notificacion = new Notification("Recorrido finalizado", {
            icon: "./Imagenes/carblue.png",
            body: " Por favor presione aqui mas información"
        });

        notificacion.onclick = () => {
            window.open("./panel.html")
        }
    }
}
//Una vez optenidos los varlores de geolocalizacion es necesario cargar el mapa, para esto utilizo la libreria de leaflet.js
//Con leaflet se pueden utilizar los mapas de openstreet, mapbox, y entre otros proveedores. Para este caso utilizo la de openstreet meramente por gusto personal
//Nota: No fue posible utilizar google maps debido a que este nos limitaba su uso gratuito.
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
//leaflet Routing Machine es la libreria que utilizaremos para calcular las rutas necesarias.
function iniciarRouter() {
    ruta = L.Routing.control({
        waypoints: [
            L.latLng(null, null),
            L.latLng(null, null)
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim() //Este es el geodecodificador que nos permitira buscar por direccione o ubicaciones
    })
    ruta.addTo(mainMap)
    console.log(ruta)
    mainMap.on('click', onMapClick) //Aqui activamos el evento onClick que nos permitirá establecer las direcciones dando click en el mapa
}

function onMapClick(e) { //Funcione que se ejecuta cuando se activa el evento onClick sobre el mapa
    let contHtml = `<Button onclick="openingMarkers(this)" class="btn-map-start">Comenzar en esta ubicación</Button>
    <Button onclick="endingMarkers(this)" class="btn-map-end">Finalizar en esta ubicación</Button>`
    popPup = L.popup()
        .setContent(contHtml)
        .setLatLng(e.latlng)
        .openOn(mainMap)
}
//Funcion de asignar ubicacion Origen
function openingMarkers(id) {
    console.log(`funciona ${id}`)
    ruta.spliceWaypoints(0, 1, popPup.getLatLng());
    mainMap.closePopup();
}
//Funcion de asignar ubicacion Destino
function endingMarkers(id) {
    console.log(`funciona ${id}`)
    ruta.spliceWaypoints(ruta.getWaypoints().length - 1, 1, popPup.getLatLng());
    mainMap.closePopup();
}
//UtilizarRuta() toma todos los datos de la ruta seleccionada, inicializa el auto y crea un objeto viaje que es el que se almacenará en firebase
function UtilizarRuta() {
    if (rutaIsOn) { //este condicional valida que no haya una ruta activa, de esta manera un usuario no puede estár en 2 viajes al tiempo
        rutaIsOn = false
            //Estos inconos son para controlar si el auto se encuentra en curso en una ruta(amarillo), si ya finalizó el recorrido (azul) o finalmente si el viaje fue detenido (rojo)
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
            //Como por ahora solo queriamos optener el punto de partida y el de destino necesitamos  saber el ultimo de los puntos ya que es posible añadir mas de 2 puntos a la ruta
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
            //Acontinuacion subimos los datos a firebase.store
        agregarDatos(viaje.geoPosInicial, viaje.geoPosFinal, viaje.geoPosActual, viaje.posInicial, viaje.posFinal, viaje.tiempo, viaje.distancia, viaje.end, viaje.stoped)
        animatedCar.on('move', movimientoCarro)
    }
}

function DetenerRuta() {
    animatedCar.stop()
    console.log(`car stoped`)
    animatedCar.setIcon(iconCarStop)
    db.collection("Viajes").doc(idViaje).update({ stoped: true })
    rutaIsOn = true;
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