const socks = require("../database/schemas/socks");
const { DESPENSA, COBIJAS } = require("./constatns");
const dockerDbsUrls = require("./../config/dockerDbs");
const connect_to_database = require("./../database/index");

function saveSocks() {
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
        $or: [{ tipo: "Cobijas" }, { tipo: "Cobija" }, { entrega: COBIJAS }],
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
      let obj = buildSockModelObjet(entrega);
      if (obj) total.push(obj);
    }

    //Se unifican los socks en un solo modelo
    for (let entrega of despensas) {
      let obj = buildSockModelObjet(entrega);
      if (obj) total.push(obj);
    }

    console.log(`Total Cobijas: ${cobijas.length}`);
    console.log(`Total Despensas: ${despensas.length}`);
    console.log(`Total Entregas con Ciudadano y Ruteador: ${total.length}`);

    //En este punto se debe unificar ambos modelos en uno solo
    //TODO: CONECTAR A LA BASE DE DATOS OBJETIVO
    for (let obj of total) {
      //En este punto las entregas ya se encuentran unificadas en un mismo modelo
      const exists = await socks.exists({ _id: obj._id });
      if (!exists) await socks.insertMany(obj);
    }
    resolve();
  });
}

function buildSockModelObjet(entrega) {
  let obj = {};
  obj._id = entrega._id;
  obj.biene = entrega.biene;
  obj.ciudadano = entrega.ciudadano ? entrega.ciudadano : entrega.usuario;
  obj.ruteador = entrega.ruteador ? entrega.ruteador : entrega.backdoor;
  obj.entrega = entrega.entrega
    ? entrega.entrega
    : entrega.tipo === "Despensas" || "Despensa"
    ? DESPENSA
    : COBIJAS;
  obj.cantidad = entrega.cantidad ? entrega.cantidad : 1;
  obj.created_at = entrega.created_at ? entrega.created_at : null;
  if (
    typeof obj.ciudadano !== "undefined" &&
    typeof obj.ruteador !== "undefined"
  )
    return obj;
}

module.exports = saveSocks;
