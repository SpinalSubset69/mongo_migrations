const dockerDbsUrls = require("../config/dockerDbs");
const originalDatabasesUrls = require("../config/originalDatabases");
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
      //const usersData = await users.find();
      const socksData = await socks.find();
      const usersData = await users.find();
      console.log("Conectando con: ", dockerDatabases[i]);
      await connect_to_db(dockerDatabases[i]);
      console.log("Guardando data en: ", dockerDatabases[i]);
      for (let user of usersData) {
        const exists = await users.exists({ _id: user._id });
        if (!exists) await users.insertMany(user);
      }
      for (let sock of socksData) {
        const exists = await socks.exists({ _id: sock._id });
        if (!exists) await socks.insertMany(sock);
      }
    }
    resolve();
  });
}
module.exports = mergeDatabaseDocker;
