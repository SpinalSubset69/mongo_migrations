const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");

function saveUsers(data) {
  return new Promise(async (resolve) => {
    console.log(`Data length: ${data.length}`);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const exist = await users.findOne({
        $or: [{ _id: data[i]._id }, { curp: data[i].curp }],
      });

      if (exist) {
        if (
          typeof data[i].folioCobijas !== "undefined" &&
          exist.folioCobijas === undefined
        ) {
          exist.folioCobijas = data[i].folioCobijas;
          await users.findOneAndUpdate({ _id: exist._id }, exist);
        }

        if (data[i]._id.toString() !== exist._id.toString()) {
          //Usuarios con misma curp pero distinto ID
          //Se busca si estan ligados a una ruta, en caso de serlo, verificar los socks
          const rutaData = await ruteadores.findOne({
            ciudadanos: data[i]._id,
          });
          const rutaExist = await ruteadores.findOne({ ciudadanos: exist._id });

          if (rutaData && rutaExist) {
            console.log("Las rutas Existen");
            //Ambos estan ligados a una ruta, se debe verificar si es la misma o distinta
            if (rutaData.ruta === rutaExist.ruta) {
              //Estan en la misma ruta
              //Verificar los socks de cada uno y ver quien tiene ligado
              const socksData = await socks.find({ ciudadano: data[i]._id });
              const socksExist = await socks.find({ ciudadano: exist._id });

              if (socksData && socksExist) {
                //Ambos tienen socks y se debe de verificar cual tiene mas y tomar ese
                if (socksData.length >= socksExist.length) {
                  //El dato de otra db tiene mas socks
                  //se debe eliminar el usuario de la db de la ruta tambien, los socks del usuario en la db se deben asignar al nuevo
                  await assignNewUserTosocks(socksExist, data[i]._id);
                  await filterCiudadanosBasedOnId(exist._id, rutaData);
                  await deleteOneInsertOne(exist, data[i]);
                } else if (socksData.length === 0) {
                  //Si el dato que viene no tiene socks, no se guarda
                  //pero se debe eliminar de la ruta
                  await filterCiudadanosBasedOnId(data[i]._id, rutaData);
                } //Si ni uno tiene socks, no se guarda el nuevo dato
              } else if (socksData && !socksExist) {
                //el dato que viene de otra db tiene ruta y socks, se debe eliminar el que esta en la base de datos y guardar el nuevo
                //Tambien se debe borrar el ciudadano que se va eliminar
                await filterCiudadanosBasedOnId(exist._id, rutaData);
                await deleteOneInsertOne(exist, data[i]);
              } else if (!socksData && socksExist) {
                //El dato que viene de otra db no tiene socks pero sí esta en una ruta, se debe eliminar de esa ruta
                //Se conserva el usuario que esta en la db
                await filterCiudadanosBasedOnId(data[i]._id, rutaData);
              } //Si ambos no tienen socks se conserva el que ya esta en la db
            } else {
              //no tienen socks
              //El usuario guardado se debe de agregar a la ruta 0
              const ruta0 = await ruteadores.findOne({ ruta: "0" });
              ruta0.ciudadanos.push(exist._id);
              await ruteadores.findOneAndUpdate({ _id: ruta0._id }, ruta0);
            }
          } else if (rutaData && !rutaExist) {
            console.log("Usuario on db no tiene ruta");
            //el dato que viene de otra db sí tiene una ruta, pero el que esta en la db no
            //Verificar los socks del usuario registrado en la db y asignarlos al ciudadano que viene de otra db
            const socksExist = await socks.find({ ciudadano: exist._id });
            //Asignar los socks del usuario en la db al nuevo
            if (socksExist) await assignNewUserTosocks(socksExist, data[i]._id);
            await deleteOneInsertOne(exist, data[i]);
          } else if (!rutaData && rutaExist) {
            console.log("Usuario en db si tiene ruta");
            //el dato  de la db sí tiene una ruta, pero el que viene de otra db no
            //si debe saber si el otro dato esta asignado a un sock y asignarlos al usuario en la base de datos
            const socksData = await socks.find({ ciudadano: data[i]._id });
            //Si hay entregas, se asignan al usuario en la db
            //No se almacena el nuevo dato, ya que no pertenece a ni una ruta
            if (socksData) await assignNewUserTosocks(socksData, exist._id);
          }
          sum++;
        }
      }

      if (!exist) {
        users.insertMany(data[i]);
      }
    }

    console.log(`Total users with same curp but different id: ${sum}`);
    resolve();
  });
}

async function filterCiudadanosBasedOnId(idToOmit, ruta) {
  console.log("Filtrando ciudadano en ruta");
  console.log(idToOmit);
  await ruteadores.findOneAndUpdate(
    { _id: ruta._id },
    {
      $pull: { ciudadanos: idToOmit },
    }
  );
}

async function deleteOneInsertOne(dataToDelete, dataToInsert) {
  console.log("Eliminando User");
  await users.deleteOne({ _id: dataToDelete._id });
  await users.insertMany(dataToInsert);
}

function assignNewUserTosocks(entregas, userId) {
  return new Promise(async (resolve) => {
    console.log("Se estan Asignando nuevos socks");
    for (let sock of entregas) {
      sock.ciudadano = userId;
      await socks.findOneAndUpdate({ _id: sock._id }, sock);
    }
    resolve();
  });
}

module.exports = saveUsers;
