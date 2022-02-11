const socks = require("./../database/schemas/socks");
const ruteadores = require("./../database/schemas/ruteadores");

function fillSocks(data) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < data.length; i++) {
      //Asegurarse que su rol sea ciudadano
      if (data[i].rol.includes("ciudadano")) {
        //Verificar si el ciudadano cuenta con una entrega, de no ser asi crear una
        const entrega = await socks.exists({ ciudadano: data[i]._id });

        if (!entrega) {
          console.log(`Ciudadano con Id: ${data[i]._id.toString()} no tiene Entrega`)
          //Verificar si el ciudadano esta enlazado con un ruteador
          const ruteador = await ruteadores.findOne({
            ciudadanos: data[i]._id,
          });

          //Si esta enlazado a un ruteador y existen ruteadores se le asigna el mismo
          if (ruteador) {
            if (
              ruteador.ruteadores != undefined &&
              ruteador.ruteadores.length > 0
            ) {
              const newSock = new socks({
                cantidad: 1,
                ruteador: ruteador.ruteadores[0],
                ciudadano: data[i]._id,
                biene: "61c37394d4360d0bc2b49130",
                entrega: "61c2617fcfc12044730493d0",
              });

              await newSock.save();
            }
          }

          //Si no esta asignado a un ruteador se le pone el ruteador 0 y se crea la entrega
          if (!ruteador) {
            const newSock = new socks({
              cantidad: 1,
              ruteador: "61a4fdb620778d94c10b4b55",
              ciudadano: data[i]._id,
              biene: "61c37394d4360d0bc2b49130",
              entrega: "61c2617fcfc12044730493d0",
            });

            await newSock.save();
          }
        }
      }
    }

    resolve();
  });
}

module.exports = fillSocks;
