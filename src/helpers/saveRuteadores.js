const ruteadores = require("../database/schemas/ruteadores");

function saveRuteadores(data) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < data.length; i++) {
      const exist = await ruteadores.findOne({ _id: data[i]._id });

      if (exist) {
        if (data[i].ciudadanos.length > 0) {
          console.log(
            `Se estan agregando ciudadanos a la ruta: ${data[i]._id}`
          );
          for (let ciudadano of data[i].ciudadanos) {
            if (exist.ciudadanos.indexOf(ciudadano) === -1) {
              exist.ciudadanos.push(ciudadano);
            }
          }

          await ruteadores.findOneAndUpdate({ _id: exist._id }, exist);
        }
      }

      if (!exist) {
        await ruteadores.insertMany(data[i]);
      }
    }

    resolve();
  });
}

module.exports = saveRuteadores;
