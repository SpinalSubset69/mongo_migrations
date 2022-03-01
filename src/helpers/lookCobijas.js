const config = require("../config");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const connect_to_database = require("./../database/index");
const { COBIJAS } = require("./constatns");
const convertToPdf = require("../utils/convertPdf");
const dockerDbsUrls = require("../config/dockerDbs");
const disconnectDb = require("../database/connect");

function lookCobijas() {
  return new Promise(async (resolve) => {
    let cobijas = [];
    const keys = Object.entries(dockerDbsUrls);
    //Recuperar todos los socks de las bases de datos excepto la objetivo
    console.log("Recuperando socks");
    for (let key of keys) {
      console.log("Conectando base de datos");
      await connect_to_database(key[1].toString());
      //Look all socks with cobija as entrega
      const entregas = await socks.find({
        $or: [{ tipo: "Cobijas" }, { entrega: COBIJAS }],
      });

      for (let entrega of entregas) {
        if (!cobijas.find((x) => x._id.toString() === entrega._id.toString())) {
          cobijas.push(entrega);
        }
      }
    }

    //Filtrar resultados que no esten indefinidos
    let total = [];
    console.log("Filtrando array");
    for (let entrega of cobijas) {
      let obj = {};
      obj.ciudadano = entrega.ciudadano ? entrega.ciudadano : entrega.usuario;
      obj.ruteador = entrega.ruteador ? entrega.ruteador : entrega.backdoor;
      total.push(obj);
    }

    //Buscar usuarios en las bases de datos
    let result = [];
    console.log("Buscando usuarios");
    for (let sock of total) {
      const keys = Object.entries(dockerDbsUrls);
      //BUSCAR USUARIO Y RUTEADOR
      let user = null;
      let ruteador = null;

      for (let key of keys) {
        await connect_to_database(key[1]);
        if (!user) user = await users.findOne({ _id: sock.ciudadano });
        if (!ruteador) ruteador = await users.findOne({ _id: sock.ruteador });

        if (user && ruteador) {
          await disconnectDb();
          break;
        }
      }

      if (user && ruteador) {
        const obj = {
          Nombre: user
            ? `${user.nombre} ${user.paterno} ${user.materno}`
            : sock.ciudadano,
          Curp: user ? user.curp : sock.ciudadano,
          Direccion: user ? user.direccion : sock.ciudadano,
          Folio: user ? user.folio : "No tiene folio",
          Ruteador:
            ruteador.nombre === "temporal"
              ? "Ruteador no asignado"
              : ruteador.nombre
              ? `${ruteador.nombre} ${
                  ruteador.paterno
                    ? `${ruteador.paterno} ${ruteador.materno}`
                    : ""
                }`
              : "",
        };
        console.log(obj);
        result.push(obj);
      }
    }

    console.table(result);
    console.log("Creando Pdf");
    convertToPdf(result, "cobijasSinFolio");
    resolve();
  });
}

module.exports = lookCobijas;
