const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const { COBIJAS, AYUNTAMIENTO, RUTEADOR } = require("./constatns");

function folioCobijas(list) {
  return new Promise(async (resolve) => {
    for (let user of list) {
      if (user.folioCobijas) {
        //Verify there is no a sock related to the user
        const existsSock = await socks.findOne({
          $and: [{ ciudadano: user._id }, { entrega: COBIJAS }],
        });

        if (!existsSock) {
          const sock = new socks();
          sock.cantidad = 1;
          sock.ciudadano = user._id;
          sock.entrega = COBIJAS;
          sock.biene = AYUNTAMIENTO;
          //Verificar si el usuario esta en una ruta
          const ruteador = await ruteadores.findOne({ ciudadanos: user._id });

          if (ruteador && ruteador.ruteadores.length > 0) {
            sock.ruteador = ruteador.ruteadores[0];
          } else if (!ruteador) {
            const ruta0 = await ruteadores.findOne({ ruta: "0" });
            ruta0.ciudadanos.push(user._id);
            await ruteadores.findOneAndUpdate({ _id: ruta0._id }, ruta0);
            sock.ruteador = RUTEADOR;
          }

          await sock.save();
          console.log(`User: ${user._id} entrega folioCobija`);
        }
      }
    }
    resolve();
  });
}

module.exports = folioCobijas;
