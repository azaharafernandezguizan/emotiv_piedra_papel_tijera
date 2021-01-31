# Piedra, papel o tijera con expresiones faciales (Versión 1).
En Diciembre de 2020 decidí adquirir una diadema Emotiv Insight para registrar actividad encefalográfica. Tras ver que para registrar ondas ECG se necesitaba una suscripción mensual, decidí probar con las expresiones faciales que con la licencia gratuita si que tenía acceso a ellas. 

He creado este pequeño ejemplo en Node.js. El archivo Cortex es simplemente los métodos que necesito para conectarme con el websocket que me proporciona los datos y es casi todo el código ejemplo que ya provee el fabricante, con unas pequeñas adaptaciones. En archivo game, lleva la lógica del juego y en el archivo piedra_papel_tijera están referenciados ambos y es dónde pongo la interacción por consola con el usuario.

Es un código muy simple, que me ha servido para familiarizarme con el dispositivo.
