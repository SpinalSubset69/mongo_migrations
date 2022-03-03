const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const connect_to_database = require("./../database/index");
const { COBIJAS, DESPENSA } = require("./constatns");
const convertToPdf = require("../utils/convertPdf");
const dockerDbsUrls = require("../config/dockerDbs");
const disconnectDb = require("../database/connect");

function lookCobijas() {
  return new Promise(async (resolve) => {
    let cobijas = [];
    let despensas = [];
    const keys = Object.entries(dockerDbsUrls);
    //Recuperar todos los socks de las bases de datos excepto la objetivo
    console.log("Recuperando socks");
    for (let key of keys) {
      console.log("Conectando base de datos");
      await connect_to_database(key[1].toString());
      //Look all socks with cobija as entrega
      const entregasCobijas = await socks.find({
        $or: [{ tipo: "Cobijas" }, { entrega: COBIJAS }],
      });

      const entregasDespensas = await socks.find({
        $or: [
          { tipo: "Despensas" },
          { tipo: "Despensa" },
          { entrega: DESPENSA },
        ],
      });

      for (let entrega of entregasCobijas) {
        if (!cobijas.find((x) => x._id.toString() === entrega._id.toString())) {
          cobijas.push(entrega);
        }
      }

      for (let entrega of entregasDespensas) {
        if (
          !despensas.find((x) => x._id.toString() === entrega._id.toString())
        ) {
          despensas.push(entrega);
        }
      }
    }
    const date = new Date();
    const fecha_reporte = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`;
    await buildCSV(cobijas, `cobijas_reporte_${fecha_reporte}`);
    await buildCSV(despensas, `despensas_reporte_${fecha_reporte}`);

    resolve();
  });
}

module.exports = lookCobijas;

function buildCSV(data, pdfName) {
  return new Promise(async (resolve) => {
    //Filtrar resultados que no esten indefinidos
    let total = [];
    console.log("Filtrando array");
    for (let entrega of data) {
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
        await disconnectDb();
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
        await disconnectDb();
      }
    }

    console.table(result);
    console.log("Creando Pdf");
    convertToPdf(result, pdfName);
    resolve();
  });
}
