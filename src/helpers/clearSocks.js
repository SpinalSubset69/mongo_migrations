const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const colors = require("colors");
const COBIJAS = "61c397661760976e2a418941";
const DESPENSA = "61c2617fcfc12044730493d0";

function clearSocks() {
  return new Promise(async (resolve) => {
    const usersList = await users.find();

    for (let user of usersList) {
      const data = await socks.find({ ciudadano: user._id });

      if (data.length > 0) {
        console.log(
          `User with ID: ${user._id} has: `.green + data.length + " socks"
        );
        let cobijas = 0;
        let despensa = 0;

        for (let sock of data) {
          if (sock.entrega.toString() === COBIJAS) cobijas++;

          if (sock.entrega.toString() === DESPENSA) despensa++;

          if (cobijas >= 2 || despensa >= 2)
            await socks.deleteOne({ _id: sock._id });
        }
      }
    }

    resolve();
  });
}

module.exports = clearSocks;
