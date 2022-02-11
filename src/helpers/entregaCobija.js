const { getRuteadores } = require(".");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const COBIJAS = "61c397661760976e2a418941";
const AYUNTAMIENTO = "61c37394d4360d0bc2b49130";
const RUTEADOR = "61a4fdb620778d94c10b4b55";

function entregaCobijas() {
  return new Promise(async (resolve) => {
    const rutas = await getRuteadores();
    let sum = 0;
    for (let ruta of rutas) {
      if (typeof ruta.ruta != "undefined") {
        if (
          ruta.ruta.includes("rural") ||
          ruta.ruta.includes("Rural") ||
          ruta.ruta.includes("Rutal")
        ) {
          for (let ciudadano of ruta.ciudadanos) {
            //Verificar ciudadano existe
            const user = await users.findOne({ _id: ciudadano });

            if (user) {
              const sock = new socks();
              sock.cantidad = 1;
              sock.ciudadano = ciudadano;
              sock.entrega = COBIJAS;
              sock.biene = AYUNTAMIENTO;

              if (ruta.ruteadores.length > 0) {
                sock.ruteador = ruta.ruteadores[0];
              } else {
                sock.ruteador = RUTEADOR;
              }
              await sock.save();
              sum++;
              //console.log(`User: ${ciudadano} entrega de cobija zona rural`);
            } else {
              console.log(`User: ${ciudadano} no existe en la base de datos`);
            }
          }
        }
      }
    }
    console.log(`Total cobijas entregadas zona rural: ${sum}`);
    resolve();
  });
}

module.exports = entregaCobijas;

/* for (let ruta of rutas) {
    console.log(ruta.ruta);
    if (ruta.ruta) {
      if (
        ruta.ruta.includes("rural") ||
        ruta.ruta.includes("Rural") ||
        ruta.ruta.includes("Rutal")
      ) {
        if (ruta.ciudadanos.length > 0) {
          for (let i = 0; i < ruta.ciudadanos.length; i++) {
            const user = await users.findById(ruta.ciudadanos[i]);
            if (user) {
              //Usuario de ruta rural
              const sock = new socks();
              sock.cantidad = 1;
              sock.ciudadano = user._id;
              sock.entrega = "61c397661760976e2a418941";
              sock.biene = "61c37394d4360d0bc2b49130";
              sock.ruteador = "61a4fdb620778d94c10b4b55";
              await sock.save();
              console.log(`Usuario: ${user._id} entrega cobija zona rural`);
            }
          }
        }
      }
    }
  } */
