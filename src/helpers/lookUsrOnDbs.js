const config = require("../config");
const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const connect_to_database = require("./../database/index");
const { RUTEADOR, AYUNTAMIENTO, DESPENSA } = require("./constatns");

function lookUserOnDbs(idToLook) {
  //A este punto no existe el usuario ni por id ni por curp, entonces se debe guardar el nuevo usuario
  //en la nueva db
  return new Promise(async (resolve) => {
    //LOOK FOR USER ON DBS
    //At the end, switch to objective db
    const keys = Object.entries(config);
    for (let key of keys) {
      if (key[1].length > 10) {
        await connect_to_database(key[1]);
        const exists = await users.findOne({ _id: idToLook });

        if (exists) {
          console.log(`Ciudadano: ${exists._id}`);
          //Se debe guardar y crear sock de despensa, asignar a la ruta 0

          //cambiar a la base de datos nueva, debido a que se buscara en todas las demas bases de datos
          //de esta manera se evita que se duplique la entrada
          await connect_to_database(config.objective_db);

          //Verificar si ya se guardo en la nueva db
          if (await users.exists({ _id: exists._id })) break;

          //Guardar usuario
          await users.insertMany(exists);

          //Crear sock
          const sock = new socks();
          sock.ruteador = RUTEADOR;
          sock.biene = AYUNTAMIENTO;
          sock.entrega = DESPENSA;
          sock.ciudadano = exists._id;

          //guardar sock
          await sock.save();

          //Agregar a la ruta 0
          await ruteadores.findOneAndUpdate(
            { ruta: "0" },
            {
              $addToSet: { ciudadanos: exists._id },
            }
          );

          console.log(`Ciudadano: ${exists._id}\tfue guardado en la nueva db`);
        }
      }
    }

    //Return to objective db
    resolve();
  });
}

module.exports = lookUserOnDbs;
