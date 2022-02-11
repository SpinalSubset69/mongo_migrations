const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const colors = require("colors");
const COBIJAS = "61c397661760976e2a418941";
const DESPENSA = "61c2617fcfc12044730493d0";

function clearSocks() {
  return new Promise(async (resolve) => {
    const data = await users.find();

    for (let user of data) {
      const sock = await socks.find({ ciudadano: user._id });

      if (sock.length > 0) {
        console.log(
          `User with ID: ${user._id} has: `.green + sock.length + " socks"
        );
        let cobijas = 0;
        let despensa = 0;

        for (let i = 0; i < sock.length; i++) {
          if (sock[i].entrega.toString() === COBIJAS) cobijas++;

          if (sock[i].entrega.toString() === DESPENSA) despensa++;

          if (cobijas >= 2 || despensa >= 2) await socks.deleteOne(sock[i]);
        }
      }
    }

    resolve();
  });
}

module.exports = clearSocks;
