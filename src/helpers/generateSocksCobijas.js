const { getUsers } = require(".");
const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");

function socksCobijas() {
  return new Promise(async (resolve) => {
    const data = await getUsers();
    let sum = 0;
    for (let user of data) {
      if (user.fechanacimiento != undefined) {
        const year = user.fechanacimiento.split("/")[2];
        const isOld = new Date().getFullYear() - year;

        if (isOld >= 65) {
          if (user.folioCobijas != undefined) {
            console.log("Este usuario mayor de 65 ya tiene sock cobija");
          }

          const sock = new socks();
          sock.cantidad = 1;
          sock.ciudadano = user._id;
          sock.entrega = "61c397661760976e2a418941";
          sock.biene = "61c37394d4360d0bc2b49130";

          if (user.ruta != undefined) {
            //User with route assigned
            const ruta = await ruteadores.find({ ruta: user.ruta });
            if (ruta) {
              if (ruta.ruteadores.length != 0) {
                sock.ruteador = ruta.ruteadores[0];
              }
            }
          } else {
            sock.ruteador = "61a4fdb620778d94c10b4b55";
          }

          const sockExists = await socks.exists({
            $and: [
              { entrega: "61c397661760976e2a418941" },
              { ciudadano: user._id },
            ],
          });

          if (!sockExists) {
            await sock.save();
            sum++;
          }
        }
      }
    }
    console.log(`Socks Created: ${sum}`);
    resolve();
  });
}

module.exports = socksCobijas;
