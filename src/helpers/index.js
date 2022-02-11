const registros = require("../database/schemas/registros");
const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const connect_to_database = require("./../database/index");
const bienes = require("./../database/schemas/bienes");
const entregas = require("./../database/schemas/entregas");

async function getBienes() {
  const array = await bienes.find();
  return array;
}

async function getEntregas() {
  const array = await entregas.find();
  return array;
}

async function getRuteadores() {
  const array = await ruteadores.find();
  return array;
}

async function getSocks() {
  const array = await socks.find();
  return array;
}

async function getRegistros() {
  const array = await registros.find();
  return array;
}

async function getUsers() {
  const array = await users.find();
  return array;
}

module.exports = {
  getBienes,
  getEntregas,
  getRuteadores,
  getSocks,
  getUsers,
  getRegistros,
};
