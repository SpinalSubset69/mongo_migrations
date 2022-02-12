const ruteadores = require("../database/schemas/ruteadores");
const users = require("../database/schemas/users");
const fs = require("fs");
const colors = require("colors");
const socks = require("../database/schemas/socks");
const { SchemaTypes } = require("mongoose");
const { getUsers } = require(".");
const { AYUNTAMIENTO, RUTEADOR } = require("./constatns");
const COBIJAS = "61c397661760976e2a418941";
const DESPENSA = "61c2617fcfc12044730493d0";

function verifyExists() {
  return new Promise(async (resolve) => {
    //Verify all users has a sock
    const allUsers = await getUsers();
    let sum = 0;
    for (let usuario of allUsers) {
      const exists = await socks.find({ ciudadano: usuario._id });

      if (!exists) {
        console.log(`Usuario: ${usuario._id} no tiene sock`);
        if (!sockExists) {
          const sock = new socks();
          sock.cantidad = 1;
          sock.ciudadano = usuario._id;
          sock.biene = AYUNTAMIENTO;
          sock.ruteador = RUTEADOR;
          sock.entrega = DESPENSA;
          await sock.save();
        }
        sum++;
      }
    }

    console.log(
      "Total users without sock: ",
      sum,
      " and created one of DESPENSA"
    );
    resolve();
  });
}

module.exports = verifyExists;
