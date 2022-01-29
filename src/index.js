const data = require("./helpers/index");
const config = require("./config/index");
const connect_to_database = require("./database/index");
const { Bienes, Users, Entregas } = require("./save");

async function test() {
  //FIRST WE NEED TO GET DATA FROM DATABASE BECAL
  await connect_to_database(config.sistema_becal_url);
  const bienes_becal = await data.getBienes();
  const users_becal = await data.getUsers();
  const entregas_becal = await data.getEntregas();
  const socks_becal = await data.getSocks();
  const ruteadores_becal = await data.getRuteadores();

  //NOW SWITCH DB EN USO
  await connect_to_database(config.db_en_uso_url);
  const bienes_en_uso = await data.getBienes();
  const users_en_uso = await data.getUsers();
  const entregas_en_uso = await data.getEntregas();
  const socks_en_uso = await data.getSocks();
  const ruteadores_en_uso = await data.getRuteadores();

  //SWITCH TO TEST DB
  await connect_to_database(config.objective_db);
  try {
    /* await Bienes(bienes_becal);
    await Entregas(entregas_becal); */
    await Users(users_becal, users_en_uso);
  } catch (ex) {
    console.log(ex.message);
  }
}

test();
