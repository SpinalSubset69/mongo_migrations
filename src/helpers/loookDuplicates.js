const users = require("../database/schemas/users");
const { getUsers } = require(".");
const socks = require("../database/schemas/socks");

function lookDuplicates() {
  return new Promise(async (resolve) => {
    //Verify all users has to a sock
    const allUsers = await getUsers();

    allUsers.map(async (user) => {
      allUsers.map(async (newUser) => {
        if (
          newUser.curp === user.curp &&
          user._id.toString() != newUser._id.toString()
        ) {
          /* console.log(`User ${user._id} duplicado con su curp`);
          console.log(`CURP: ${user.curp} `); */

          const userSock = await socks.findOne({ ciudadano: user._id });
          const newUserSock = await socks.findOne({ ciudadano: newUser._id });

          if (!userSock) {
            console.log(`User with CURP: ${user.curp} doesnt have sock `);
          }

          if (!newUserSock) {
            console.log(`User with CURP: ${newUser.curp} doesnt have sock `);
          }
        }
      });
    });

    resolve();
  });
}

module.exports = lookDuplicates;
