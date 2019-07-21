let doc, eaux, snapaux, salidaHtml
    //Para poder utilizar firebase en una aplicacion es necesario iniciar las librerias de firebase con los parametros personales que este entrega
let firebaseConfig = {
    apiKey: " AIzaSyDX_1g0J3IoS5hL9FIGdFcW5QX-wDNVP4w",
    authDomain: "pruebaever-37590.firebaseapp.com",
    databaseURL: "https://pruebaever-37590.firebaseio.com",
    projectId: "pruebaever-37590",
    storageBucket: "pruebaever-37590.appspot.com",
    messagingSenderId: "531136037713",
};
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
setTimeout(() => {
    cargarDatos()
    console.log(`dataload,settime`)
}, 1500);
//La siguiente funcion recibe los datos del objeto viaje y almacena los datos en firebase.store
async function agregarDatos(geoPosInicial, geoPosFinal, geoPosActual, posInicial = 'indeterminado', posFinal = 'indeterminado', tiempo, distancia, end, stoped) {
    await db.collection("Viajes").add({
            tiempo: tiempo,
            distancia: distancia,
            posicionInicial: posInicial,
            posicionFinal: posFinal,
            geoPosicionInicial: {
                lat: geoPosInicial.lat,
                lng: geoPosInicial.lng
            },
            geoPosicionFinal: {
                lat: geoPosFinal.lat,
                lng: geoPosFinal.lng
            },
            geoPosicionActual: {
                lat: geoPosActual.lat,
                lng: geoPosActual.lng
            },
            end: end,
            stoped: stoped
        }).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id); //el callback retorna el id genrado automaticamente por firebase al insertar un documento
            idViaje = docRef.id
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
}
//La funcion cargar datos se encarga de consultar los datos en firebase.store y de actualizar el DOM
function cargarDatos() {
    salidaHtml = ``
    var i = 0
    db.collection("Viajes").get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
            i += 1
            renderDatos(doc, i)
        });
        document.getElementById("container-block").innerHTML = salidaHtml
            //document.getElementsByClassName("fas fa-trash").addEventListener('click', eliminarViaje)
    })
}

//Real time-- Controla los eventos sobre firebase para poder actualizar el DOM
db.collection("Viajes").onSnapshot(snapshot => {
        snapaux = snapshot
        let cambios = snapshot.docChanges()
        console.log(cambios)
        cambios.forEach(cambio => {
            if (cambio.type == 'added' || cambio.type == 'removed') {
                cargarDatos()
            } else if (cambio.type == 'modified') {
                document.getElementById(`${cambio.doc.id}-posAct`).innerHTML = `GeoUbicación Actual:
            </span>
            lat:${cambio.doc.data().geoPosicionActual.lat},lng:${cambio.doc.data().geoPosicionActual.lng}
            </span>`
                var carcolor = ``
                if (cambio.doc.data().end) {
                    carcolor = `Imagenes/carblue.png`
                } else if (cambio.doc.data().stoped) {
                    carcolor = `Imagenes/carred.png`
                } else {
                    carcolor = `Imagenes/caryellow.png`
                }
                document.getElementById(`${cambio.doc.id}-img`).setAttribute("src", `${carcolor}`)
            }
        })
    })
    //renderDatos crea un templateString utilizando las propiedades de ES6 para posteriormente imprimirlo en el DOM
minutosConv = (segundos) => {
    return Math.floor(segundos / 60)
}
distanciaConv = (metros) => {
    if (metros < 1000) {
        return `${metros} m`
    } else {
        return `${metros/1000} Km`
    }
}

function renderDatos(doc, i) {
    /* console.log(doc.id)
     console.log(doc.data())*/
    var carcolor = ``
    if (doc.data().end) {
        carcolor = `Imagenes/carblue.png`
    } else if (doc.data().stoped) {
        carcolor = `Imagenes/carred.png`
    } else {
        carcolor = `Imagenes/caryellow.png`
    }
    salidaHtml += `
    <div id="${doc.id}-block" class="block">
        <img id="${doc.id}-img" src="${carcolor}" alt="">
        <div data-id="${doc.id}" class="text">
        <button onclick="eliminarViaje(this)"><i id="delete" class="fas fa-trash"></i></button>
        <h3>
            <span class="title-text">
                Recorrido #${i}:
            </span>
        </h3>
        <span>
            <span class="title-text">
                Ubicación Inicial:
            </span> ${doc.data().posicionInicial}
        </span>
        <span>
            <span class="title-text">
                Ubicación Final:
            </span> 
            ${doc.data().posicionFinal}
        </span>
        <span>
            <span class="title-text">
                GeoUbicación Inicial:
            </span> 
            lat:${doc.data().geoPosicionInicial.lat},lng:${doc.data().geoPosicionInicial.lng}
        </span>
        <span>
            <span class="title-text">
                GeoUbicación Final:
            </span>
            lat:${doc.data().geoPosicionFinal.lat},lng:${doc.data().geoPosicionFinal.lng}
        </span>
        <span>
            <span id="${doc.id}-posAct" class="title-text">
                GeoUbicación Actual:
            </span>
            lat:${doc.data().geoPosicionActual.lat},lng:${doc.data().geoPosicionActual.lng}
        </span>
        <span>
            <span  class="title-text">
                Tiempo:
            </span>
            ${minutosConv(doc.data().tiempo)} Min
        </span>
        <span>
            <span  class="title-text">
                Distancia:
            </span>
            ${distanciaConv(doc.data().distancia)}
        </span>
        </div>
    </div>`
}
//Control del evento onclick sobre el boton de eliminar
function eliminarViaje(e) {
    eaux = e
    let idDel = e.parentElement.getAttribute('data-id')
    db.collection("Viajes").doc(idDel).delete()

}