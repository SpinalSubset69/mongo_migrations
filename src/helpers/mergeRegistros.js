const connect_to_database = require("./../database/index");
const originalDbs = require("./../config/originalDatabases");
const config = require("./../config/index");
const registros = require("./../database/schemas/registros");
const socks = require("../database/schemas/socks");
const { AYUNTAMIENTO } = require("./constatns");
function mergeRegistros() {
  return new Promise(async (resolve) => {
    //LOS REGISTROS ESTAN SOLO EN LA BASE DE DATOS: wd2qv
    //DB4 en originalDbs
    await connect_to_database(originalDbs.db4);

    console.log("Obteniendo Registros");
    //Recuperar registros
    const registrosData = await registros.find({
      $and: [
        { fecha: { $ne: null } },        
        { fecha: { $ne: "1-MAR-2022" } },
        { fecha: { $ne: "28-FEB-2022" } },
        { fecha: { $ne: "27-FEB-2022" } },
        { fecha: { $ne: "26-FEB-2022" } },
        { fecha: { $ne: "25-FEB-2022" } },
        { fecha: { $ne: "24-FEB-2022" } },
        { fecha: { $ne: "23-FEB-2022" } },
        { fecha: { $ne: "22-FEB-2022" } },
        { fecha: { $ne: "21-FEB-2022" } },
        { fecha: { $ne: "20-FEB-2022" } },
        { fecha: { $ne: "19-FEB-2022" } },
        { fecha: { $ne: "18-FEB-2022" } },
        { fecha: { $ne: "17-FEB-2022" } },
        { fecha: { $ne: "16-FEB-2022" } },
        { fecha: { $ne: "15-FEB-2022" } },
        { fecha: { $ne: "14-FEB-2022" } },
        { fecha: { $ne: "13-FEB-2022" } },
        { fecha: { $ne: "12-FEB-2022" } },
      ],
    });

    console.log("Guardando Registros en nueva Base de Datos");
    await connect_to_database(config.objective_db);
    for (let registro of registrosData) {
      const sock = new socks();
      sock.entrega = registro.entrega;
      sock.folio = registro.folio;
      sock.fecha = registro.fecha;
      sock.ruteador = registro.ruteador;
      sock.dependencia = AYUNTAMIENTO;
      await sock.save();
    }
    console.log(`Total: ${registrosData.length}`);
    resolve();
  });
}

module.exports = mergeRegistros;
