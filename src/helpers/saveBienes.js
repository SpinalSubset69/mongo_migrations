const bienes = require("../database/schemas/bienes");
const connect_to_database = require("./../database/index");
const originalDatabases = require("./../config/originalDatabases");
const config = require("./../config/index");

function saveBienes() {
  return new Promise(async (resolve) => {
    console.log(`Save Bienes`);
    await connect_to_database(originalDatabases.db4);
    const data = await bienes.find();

    await connect_to_database(config.objective_db);
    for (let biene of data) {
      const exists = await bienes.exists({ _id: biene._id });
      if (!exists) await bienes.insertMany(biene);
    }
    resolve();
  });
}

module.exports = saveBienes;
