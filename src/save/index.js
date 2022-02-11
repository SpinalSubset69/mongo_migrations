const colors = require("colors");
const bienes = require("../database/schemas/bienes");
const entregas = require("../database/schemas/entregas");
const saveUsers = require("../helpers/saveUsers");
const saveSocks = require("../helpers/saveSocks");
const saveRuteadores = require("../helpers/saveRuteadores");
const saveBienes = require("../helpers/saveBienes");
const saveEntregas = require("../helpers/saveEntregas");

//const finalArray = [...new Set([...users_becal, ...users_en_uso])];

async function Users(users_becal, users_en_uso, users_en_db1, users_en_db2) {
  console.log(`Saving Users from becal`.green);
  await saveUsers(users_becal);
  console.log(`Users from becal saved`.green);

  console.log(`Saving Users from use`.green);
  await saveUsers(users_en_uso);
  console.log(`Users from uso saved`.green);

  console.log(`Saving users from db_1`.green);
  await saveUsers(users_en_db1);
  console.log(`Users from db_1 saved`.green);

  console.log(`Saving users from db_2`.green);
  await saveUsers(users_en_db2);
  console.log(`Users from db_2 saved`.green);
}

async function Socks(
  socks_becal,
  socks_en_uso,
  socks_en_db1,
  socks_en_db2,
  registros_en_db2
) {
  console.log(`Saving socks from becal`.green);
  await saveSocks(socks_becal);
  console.log(`Socks from becal saved`.green);

  console.log(`Saving socks from use`.green);
  await saveSocks(socks_en_uso);
  console.log(`Socks from uso saved`.green);

  console.log(`Saving socks from db_1`.green);
  await saveSocks(socks_en_db1);
  console.log(`Socks from db_1 saved`.green);

  console.log(`Saving socks from db_2`.green);
  await saveSocks(socks_en_db2);
  console.log(`Socks from db_2 saved`.green);

  console.log(`Saving registros from db_2`.green);
  await saveSocks(registros_en_db2);
  console.log(`registros from db_2 saved`.green);
}

async function Ruteadores(
  ruteadores_becal,
  ruteadores_en_uso,
  ruteadores_en_db1,
  ruteadores_en_db2
) {
  console.log(`Saving Ruteadores from becal`.green);
  await saveRuteadores(ruteadores_becal);
  console.log(`Ruteadores from becal saved`.green);

  console.log(`Saving Ruteadores from use`.green);
  await saveRuteadores(ruteadores_en_uso);
  console.log(`Ruteadores from uso saved`.green);

  console.log(`Saving Ruteadores from db_1`.green);
  await saveRuteadores(ruteadores_en_db1);
  console.log(`Ruteadores from db_1 saved`.green);

  console.log(`Saving Ruteadores from db_2`.green);
  await saveRuteadores(ruteadores_en_db2);
  console.log(`Ruteadores from db_2 saved`.green);
}

async function Bienes(data) {
  await saveBienes(data);
  console.log("Bienes Saved".green);
}

async function Entregas(data) {
  await saveEntregas(data);
  console.log("Entregas Saved".green);
}

module.exports = {
  Users,
  Bienes,
  Socks,
  Entregas,
  Ruteadores,
};
