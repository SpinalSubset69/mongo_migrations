const entregas = require("../database/schemas/entregas");
const connect_to_database = require("./../database/index");
const originalDatabases = require("./../config/originalDatabases");
const config = require("./../config/index");

function saveEntregas(data) {
  return new Promise(async (resolve) => {
    console.log(`Guardando Entregas`);
    await connect_to_database(originalDatabases.db4);
    const data = await entregas.find();

    await connect_to_database(config.objective_db);
    for (let entrega of data) {
      const exists = await entregas.exists({ _id: entrega._id });
      if (!exists) await entregas.insertMany(entrega);
    }

    resolve();
  });
}

module.exports = saveEntregas;
