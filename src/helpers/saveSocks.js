const socks = require("../database/schemas/socks");

function saveSocks(data) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < data.length; i++) {
      const exist = await socks.exists({ _id: data[i]._id });

      if (!exist) {
        socks.insertMany(data[i]);
      }
    }

    resolve();
  });
}

module.exports = saveSocks;
