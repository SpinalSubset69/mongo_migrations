const fs = require("fs");
const users = require("../database/schemas/users");
const colors = require("colors");
const ruteadores = require("../database/schemas/ruteadores");

function assignRuteador() {
  return new Promise(async (resolve) => {
    const data = await ruteadores.find();

    for (let ruteador of data) {
      if (typeof ruteador.ruta === "undefined") ruteador.ruta = "0";
      // Si no hay ruteador asignado, asignar uno temporal
      if (ruteador.ruteadores.length === 0) {
        ruteador.ruteadores.push("61a4fdb620778d94c10b4b55");
        await ruteadores.findOneAndUpdate({ _id: ruteador._id }, ruteador);
      }

      //Verificar que existan los ciudadanos en la base de datos
      for (let j = 0; j < ruteador.ciudadanos; j++) {
        const exists = await users.exists(ruteador.ciudadanos[j]);
        if (!exists) {
          console.log("User doesnt exists");
        }
      }
    }
    resolve();
  });
}

module.exports = assignRuteador;
