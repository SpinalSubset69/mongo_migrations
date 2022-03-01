const socks = require("../database/schemas/socks");
const { DESPENSA, COBIJAS } = require("./constatns");
const dockerDbsUrls = require("./../config/dockerDbs");
const connect_to_database = require("./../database/index");

function saveSocks(data) {
  return new Promise(async (resolve) => {
    const cobijas = [];
    const despensas = [];
    const keys = Object.entries(dockerDbsUrls);
    //Recuperar todos los socks de las bases de datos excepto la objetivo
    console.log("Recuperando socks");
    for (let key of keys) {
      console.log("Conectando base de datos");
      await connect_to_database(key[1].toString());
      //Look all socks with cobija as entrega
      const cobijasSocks = await socks.find({
        $or: [{ tipo: "Cobijas" }, { entrega: COBIJAS }],
      });

      for (let entrega of cobijasSocks) {
        if (!cobijas.find((x) => x._id.toString() === entrega._id.toString())) {
          cobijas.push(entrega);
        }
      }

      const despensasSocks = await socks.find({
        $or: [
          { tipo: "Despensas" },
          { tipo: "Despensa" },
          { entrega: DESPENSA },
        ],
      });

      for (let entrega of despensasSocks) {
        if (
          !despensas.find((x) => x._id.toString() === entrega._id.toString())
        ) {
          despensas.push(entrega);
        }
      }
    }

    let total = [];
    console.log("Filtrando array");
    for (let entrega of cobijas) {
      let obj = {};
      obj.ciudadano = entrega.ciudadano ? entrega.ciudadano : entrega.usuario;
      obj.ruteador = entrega.ruteador ? entrega.ruteador : entrega.backdoor;
      if (
        typeof obj.ciudadano !== "undefined" &&
        typeof obj.ruteador !== "undefined"
      ) {
        total.push(obj);
      }
    }

    for (let entrega of despensas) {
      let obj = {};
      obj.ciudadano = entrega.ciudadano ? entrega.ciudadano : entrega.usuario;
      obj.ruteador = entrega.ruteador ? entrega.ruteador : entrega.backdoor;
      total.push(obj);
    }

    console.log(`Total Cobijas: ${cobijas.length}`);
    console.log(`Total Despensas: ${despensas.length}`);
    console.log(`Total Entregas con Ciudadano y Ruteador: ${total.length}`);
    resolve();
  });
}

module.exports = saveSocks;
