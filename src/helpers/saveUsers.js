const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const dockerDbsUrls = require("./../config/dockerDbs");
const connect_to_database = require("./../database/index");
const config = require("./../config/index");
const { RUT0 } = require("./constatns");

function saveUsers() {
  return new Promise(async (resolve) => {
    const keys = Object.entries(dockerDbsUrls);
    let total = [];
    const curpRepeated = [];
    console.log("Obteniendo Usuarios");
    for (let key of keys) {
      await connect_to_database(key[1].toString());
      const usersData = await users.find();
      for (let user of usersData) {
        if (!total.find((x) => x._id.toString() === user._id.toString()))
          total.push(user);
      }
    }

    console.log("Filtrando Usuarios");
    await connect_to_database(config.objective_db);
    for (let user of total) {
      let filtered = [];
      if (user.curp) {
        filtered = total.filter((x) => x.curp === user.curp);
        if (filtered.length > 1) {
          const user1 = filtered[0];
          const user2 = filtered[1];
          const user3 = filtered.length === 3 ? filtered[2] : null;

          //Buscar socks y asignar los socks al usuario 1
          const socksData = await socks.find({ _id: user2._id });
          if (socksData) await assignNewUserTosocks(socksData, user1._id);
          //Buscar ruta y asignar a usuario 1
          const rutData = await ruteadores.find({ ciudadanos: user2._id });
          if (rutData) await filterCiudadanosBasedOnId(user2._id, user1._id);

          let socksData2 = null;
          let rutData2 = null;
          if (user3) {
            socksData2 = await socks.find({ _id: user3._id });
            rutData2 = await ruteadores.find({ ciudadanos: user3._id });
            if (socksData2) await assignNewUserTosocks(socksData2, user1._id);
            if (rutData2) await filterCiudadanosBasedOnId(user3._id), user1._id;
          }

          if (!rutData && !rutData2) await assignToTempRut(user1._id);
          //SE FILTRAN DEL ARREGLO PRINCIPAL Y SE AGREGAN A OTRO
          total = total.filter((x) => x.curp !== user.curp);
          curpRepeated.push(user1);
        }
      }
    }
    console.log(`Users length: ${total.length}`);
    console.log(`Curp Repeated Length ${curpRepeated.length}`);

    console.log("Guardando Usuarios");
    await saveUsersAsync(total);
    await saveUsersAsync(curpRepeated);
    console.log("Usuarios Guardados");

    resolve();
  });
}

async function filterCiudadanosBasedOnId(idToOmit, idToAdd) {
  //borra el ciudadano de cualquier ruta que exista
  console.log("Filtrando ciudadano en ruta");
  console.log(idToOmit);
  await ruteadores.updateMany(
    { ciudadanos: idToOmit },
    {
      $pull: { ciudadanos: idToOmit },
    }
  );

  await ruteadores.updateMany(
    { ciudadanos: idToOmit },
    {
      $push: { ciudadanos: [idToAdd] },
    }
  );
}

function assignNewUserTosocks(entregas, userId) {
  return new Promise(async (resolve) => {
    console.log("Se estan Asignando nuevos socks");
    for (let sock of entregas) {
      await socks.findOneAndUpdate(
        { _id: sock._id },
        {
          ciudadano: userId,
        }
      );
    }
    resolve();
  });
}

function saveUsersAsync(data) {
  return new Promise(async (resolve) => {
    for (let user of data) {
      const exists = await users.exists({ _id: user._id });
      if (!exists) await users.insertMany(user);
    }
    resolve();
  });
}

async function assignToTempRut(userId) {
  await socks.findOneAndUpdate(
    { _id: RUT0 },
    {
      $push: { ciudadanos: userId },
    }
  );
}

module.exports = saveUsers;
