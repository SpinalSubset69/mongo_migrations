const ruteadores = require("../database/schemas/ruteadores");

function saveRuteadores(data) {
  return new Promise(async (resolve) => {
    console.log(`Data length: ${data.length}`);
    for (let i = 0; i < data.length; i++) {
      const exist = await ruteadores.findById(data[i]._id);

      if (exist) {
        if (data[i].ciudadanos.length > 0) {
          for (let ciudadano of data[i].ciudadanos) {
            if (exist.ciudadanos.indexOf(ciudadano) === -1) {
              exist.ciudadanos.push(ciudadano);
            }
          }

          await ruteadores.findOneAndUpdate({ _id: exist._id }, exist);
        }
      }

      if (!exist) {
        ruteadores.insertMany(data[i]);
      }
    }

    resolve();
  });
}

module.exports = saveRuteadores;
