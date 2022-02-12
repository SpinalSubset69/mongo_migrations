const data = require("./helpers/index");
const config = require("./config/index");
const connect_to_database = require("./database/index");
const colors = require("colors");
const socksCobijas = require("./helpers/generateSocksCobijas");
const { Bienes, Entregas, Users, Socks, Ruteadores } = require("./save");
const assignRuteador = require("./helpers/assignRuteador");
const clearSocks = require("./helpers/clearSocks");
const verifyExists = require("./helpers/verifyExists");
const entregaCobijas = require("./helpers/entregaCobija");
const lookDuplicates = require("./helpers/loookDuplicates");
const folioCobijas = require("./helpers/folioCobijas");

(async function main() {
  //FIRST WE NEED TO GET DATA FROM DATABASE BECAL
  await connect_to_database(config.sistema_becal_url);
  console.log("Retrieving data from becal".green);
  const bienes_becal = await data.getBienes();
  const users_becal = await data.getUsers();
  const entregas_becal = await data.getEntregas();
  const socks_becal = await data.getSocks();
  const ruteadores_becal = await data.getRuteadores();

  //NOW SWITCH DB EN USO
  await connect_to_database(config.db_en_uso_url);
  console.log("Retrieving data from uso".green);
  const users_en_uso = await data.getUsers();
  const socks_en_uso = await data.getSocks();
  const ruteadores_en_uso = await data.getRuteadores();

  await connect_to_database(config.db1);
  console.log("Retrieving data from db1".green);
  const users_en_db1 = await data.getUsers();
  const socks_en_db1 = await data.getSocks();
  const ruteadores_en_db1 = await data.getRuteadores();

  await connect_to_database(config.db2);
  console.log("Retrieving data from db2".green);
  const users_en_db2 = await data.getUsers();
  const socks_en_db2 = await data.getSocks();
  const ruteadores_en_db2 = await data.getRuteadores();
  const registros_en_db2 = await data.getRegistros();

  //SWITCH TO TEST DB
  await connect_to_database(config.objective_db);
  try {
    //Bienes
    await Bienes(bienes_becal);

    //Entregas
    await Entregas(entregas_becal);

    //Ruteadores
    await Ruteadores(
      ruteadores_becal,
      ruteadores_en_uso,
      ruteadores_en_db1,
      ruteadores_en_db2
    );

    //SOCKS
    await Socks(
      socks_becal,
      socks_en_uso,
      socks_en_db1,
      socks_en_db2,
      registros_en_db2
    );

    //USERS
    await Users(users_becal, users_en_uso, users_en_db1, users_en_db2);

    //Assign ruteadores
    await assignRuteador();

    await verifyExists();

    await entregaCobijas();

    await folioCobijas(users_becal);
    await folioCobijas(users_en_uso);
    await folioCobijas(users_en_db1);
    await folioCobijas(users_en_db2);

    //await lookDuplicates();

    //Clear cloned socks
    await clearSocks();

    console.log("Program Ended".red);
  } catch (ex) {
    console.log(ex.message.toString().red);
  }
})();
