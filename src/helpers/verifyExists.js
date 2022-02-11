const ruteadores = require("../database/schemas/ruteadores");
const users = require("../database/schemas/users");
const fs = require("fs");
const colors = require("colors");
const socks = require("../database/schemas/socks");
const { SchemaTypes } = require("mongoose");
const { getUsers } = require(".");
const COBIJAS = "61c397661760976e2a418941";
const DESPENSA = "61c2617fcfc12044730493d0";

function verifyExists() {
  return new Promise(async (resolve) => {
    //Verify all users has to a sock
    const allUsers = await getUsers();
    let sum = 0;
    for (let usuario of allUsers) {
      const exists = await socks.findOne({ ciudadano: usuario._id });
      if (!exists) {
        console.log(`Usuario: ${usuario._id} no tiene sock`);
        const sock = new socks();
        sock.cantidad = 1;
        sock.ciudadano = usuario._id;
        sock.biene = "61c37394d4360d0bc2b49130";
        sock.ruteador = "61a4fdb620778d94c10b4b55";

        const sockExists = await socks.findOne({
          $and: [{ ciudadano: usuario._id }, { entrega: DESPENSA }],
        });

        if (!sockExists) {
          sock.entrega = DESPENSA;
          await sock.save();
        }
        sum++;
      }
    }

    console.log("Total users without sock: ", sum);
    resolve();
  });
}

module.exports = verifyExists;
