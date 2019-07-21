# Prueba tecnica para Smart Seals- Ever Acosta

_
Se debe desarrollar una aplicación web que muestre en el panel central un mapa donde el usuario pueda escoger dos puntos distantes entre si.  Una vez se seleccionan los puntos se debe pintar un carro de color amarillo que recorra las calles de esa ciudad y deberá ir del punto A al punto B.  Una vez inicie el vehículo a moverse, en otro componente de la página web, se deben mostrar la direcciones (calles y carreras) que corresponde a cada punto junto con su información de geolocalización (Lat y Long). Una vez el vehículo llegue al punto final (B), el vehículo debe cambiar de color y se debe generar un notificación web indicando el final del recorrido.

Toda la información gps y direcciones por donde viaje el vehículo debe guardarse en una base de datos realtime (preferible firebase).  En otro componente se debe desplegar toda la información guardada en firebase a petición del usuario al pulsar un botón o automáticamente una vez se termine el recorrido.

La prueba la puedes realizar en web o móvil según preferencia, experiencia y conocimiento, sin embargo si cuentas con las capacidades para hacerlo en ambos (web y móvil), esto sumara puntos a la hora de ser evaluado._

## Paneles 🚀

_la aplicacion dispone de 2 paneles, uno en el que se podran realizar viajes utilizando las rutas, y otro en el que se podrá observar la informacion de dichos viajes en tiempo real_


### Recomendación 📋

_Si desea ejecutar el codigo en un servidor local es recomendable que esta prueba se realice con "firebase serve" para evitar posibles errores_

### Codigo fuente 🔧

_El codigo base de la aplicación lo puede observar en la carpeta "Public"_


## Ejecutando las pruebas ⚙️

_la pruebas las puede realizar en la siguiente [dirección](https://pruebaever-37590.firebaseapp.com/)_
_Se dispone de 2 interfaces bastantes intuitivas en las que podrá observar un intercambio en tiempo real cada vez que:_
* Seleccione una ruta
* Detenga un viaje
* Elimine un registro
* Este en movimiento un auto

## Construido con 🛠️

* [leaflet](https://leafletjs.com/) - Librería de JS para el control de mapas dinamicos
* [Firebase](https://firebase.google.com/?hl=es-419) - Servicio de base de datos real-time y de hosting

## Contribuyendo 🖇️

Por favor lee el [CONTRIBUTING.md](https://gist.github.com/villanuevand/xxxxxx) para detalles de nuestro código de conducta, y el proceso para enviarnos pull requests.

## Autor ✒️

_Menciona a todos aquellos que ayudaron a levantar el proyecto desde sus inicios_

* **Ever Luis Acosta González** - [EverAcosta](https://github.com/EverAcosta)

También puedes mirar la lista de todos los [contribuyentes](https://github.com/EverAcosta/PruebaTecnicaMapa/contributors) quíenes han participado en este proyecto. 

## Licencia 📄

Este proyecto está bajo la Licencia (MIT) - mira el archivo [LICENSE.md](LICENSE.md) para detalles
