const dockerDbsUrls = require("../config/dockerDbs");
const originalDatabasesUrls = require("../config/originalDatabases");
const bienes = require("../database/schemas/bienes");
const entregas = require("../database/schemas/entregas");
const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const connect_to_db = require("./../database/index");

function mergeDatabaseDocker() {
  return new Promise(async (resolve) => {
    const originalDatabases = Object.values(originalDatabasesUrls);
    const dockerDatabases = Object.values(dockerDbsUrls);

    for (let i = 0; i < 4; i++) {
      console.log("Conectando con: ", originalDatabases[i]);
      await connect_to_db(originalDatabases[i]);
      console.log("Obetniendo data de: ", originalDatabases[i]);

      //Get Data
      const socksData = await socks.find();
      const usersData = await users.find();
      const ruteadoresData = await ruteadores.find();
      const entregasData = await entregas.find();
      const bienesData = await bienes.find();

      //Save Data
      console.log("Conectando con: ", dockerDatabases[i]);
      await connect_to_db(dockerDatabases[i]);
      console.log("Guardando data en: ", dockerDatabases[i]);

      //ENTREGAS
      for (let entrega of entregasData) {
        const exists = await entregas.exists({ _id: entrega._id });
        if (!exists) await entregas.insertMany(entrega);
      }

      //BIENES
      for (let biene of bienesData) {
        const exists = await bienes.exists({ _id: biene._id });
        if (!exists) await bienes.insertMany(biene);
      }

      //RUTEADORES
      for (let ruteador of ruteadoresData) {
        const exists = await ruteadores.exists({ _id: ruteador._id });
        if (!exists) await ruteadores.insertMany(ruteador);
      }

      //USERS
      for (let user of usersData) {
        const exists = await users.exists({ _id: user._id });
        if (!exists) await users.insertMany(user);
      }

      //SOCKS
      for (let sock of socksData) {
        const exists = await socks.exists({ _id: sock._id });
        if (!exists) await socks.insertMany(sock);
      }
    }
    resolve();
  });
}
module.exports = mergeDatabaseDocker;
