const users = require("../database/schemas/users");
const colors = require("colors");
const ruteadores = require("../database/schemas/ruteadores");
const { RUTEADOR } = require("./constatns");

//Se debe mandar llamar desues de guardar los datos en la db
function assignRuteador() {
  return new Promise(async (resolve) => {
    const data = await ruteadores.find();

    for (let ruteador of data) {
      //Si la ruta no tiene nombre se le asigna el nombre de 0
      if (!ruteador.ruta) ruteador.ruta = "0";
      // Si no hay ruteador asignado, asignar uno temporal
      if (ruteador.ruteadores.length === 0) {
        await ruteadores.findOneAndUpdate(
          { _id: ruteador._id },
          {
            $push: { ruteadores: RUTEADOR },
          }
        );
      }

      //Verificar que existan los ciudadanos en la base de datos
      for (let ciudadano of ruteador.ciudadanos) {
        const exists = await users.exists({ _id: ciudadano });
        if (!exists) console.log(`User: ${ciudadano} doesnt exists`);
      }
    }
    resolve();
  });
}

module.exports = assignRuteador;
