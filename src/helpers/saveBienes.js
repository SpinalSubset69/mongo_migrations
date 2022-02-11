const bienes = require("../database/schemas/bienes");

function saveBienes(data) {
  return new Promise(async (resolve) => {
    console.log(`Data length: ${data.length}`);
    for (let i = 0; i < data.length; i++) {
      const exist = await bienes.findById(data[i]._id);

      if (!exist) {
        bienes.insertMany(data[i]);
      }
    }

    resolve();
  });
}

module.exports = saveBienes;
