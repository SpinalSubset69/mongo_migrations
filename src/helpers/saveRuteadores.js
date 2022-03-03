const config = require("../config");
const ruteadores = require("../database/schemas/ruteadores");
const dockerDbsUrls = require("./../config/dockerDbs");
const connect_to_database = require("./../database/index");

function saveRuteadores() {
  return new Promise(async (resolve) => {
    const keys = Object.entries(dockerDbsUrls);
    const result = [];
    for (let key of keys) {
      await connect_to_database(key[1].toString());
      const data = await ruteadores.find();

      for (let rut of data) {
        const find = result.find(
          (x) => x._id.toString() === rut._id.toString()
        );
        const indexOf = result.indexOf(find);
        if (
          find &&
          typeof find.ciudadanos !== "undefined" &&
          typeof rut.ciudadanos !== "undefined"
        ) {
          console.log(`Ruteador en la ruta: ${find.ruteadores[0]}`);
          console.log(`Ciudadanos en la ruta: ${find.ciudadanos.length}`);
          //Ya existe en el arreglo, se deben verificar los usuarios
          if (rut.ciudadanos.length > find.ciudadanos.length) {
            //Tiene mas ciudadanos que el registro en el array
            for (let ciudadano of rut.ciudadanos) {
              if (
                !find.ciudadanos.find(
                  (x) => x.toString() === ciudadano.toString()
                )
              ) {
                find.ciudadanos.push(ciudadano);
              }
            }
            console.log(
              `Ciudadanos en la ruta después de agregar el resto: ${find.ciudadanos.length}`
            );
          }
        }

        if (!result.find((x) => x._id.toString() === rut._id.toString()))
          result.push(rut);

        console.log("\n");
      }
    }
    console.log(`Total of ruteadores: ${result.length}`);

    //GUARDAR RUTEADORES
    await connect_to_database(config.objective_db);
    await ruteadores.insertMany(result);
    resolve();
  });
}

module.exports = saveRuteadores;
