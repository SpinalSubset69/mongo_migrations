const entregas = require("../database/schemas/entregas");

function saveEntregas(data) {
  return new Promise(async (resolve) => {
    console.log(`Data length: ${data.length}`);
    for (let i = 0; i < data.length; i++) {
      const exist = await entregas.findById(data[i]._id);

      if (!exist) {
        entregas.insertMany(data[i]);
      }
    }

    resolve();
  });
}

module.exports = saveEntregas;
