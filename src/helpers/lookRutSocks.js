const config = require("../config");
const dockerDbsUrls = require("./../config/dockerDbs");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const connect_to_database = require("./../database/index");
const { COBIJAS, DESPENSA } = require("./constatns");
const convertToPdf = require("../utils/convertPdf");

function lookRutSocks() {
  return new Promise(async (resolve) => {
    //Buscar cuantas entregas ha hecho cada ruteador
    const ruts = []; //Array para almacenar la información
    const entregas = [];
    let result = [];
    let result0 = [];
    const rutsWithSocks = [];
    const rutsWithoutSocks = [];

    const keys = Object.entries(dockerDbsUrls);
    console.log("Buscando Ruteadores en cada base de datos");

    for (let key of keys) {
      //conectarse en cada base de datos para buscar a los ruteadores
      await connect_to_database(key[1]);
      //Se buscara por el rol de ruteador
      const rutsOnDb = await users.find({ rol: "ruteador" });

      for (let rut of rutsOnDb) {
        //!ruts.find((x) => x._id.toString() === rut._id.toString())
        //AQUI SE PUEDE AGREGAR CUALQUIER FILTRO QUE SE DESEE
        if (!ruts.find((x) => x._id.toString() === rut._id.toString())) {
          //Agregar al array
          ruts.push(rut);
        }
      }
    }

    console.log("Buscando entregas de cada ruteador");
    for (let ruteador of ruts) {
      //Se buscara en todos los socks cuales son del ruteador
      const keys = Object.entries(dockerDbsUrls);

      for (let key of keys) {
        await connect_to_database(key[1].toString());
        const entries = await socks.find({
          $or: [{ ruteador: ruteador._id }, { backdoor: ruteador._id }],
        });

        console.log(
          `Ruteador: ${ruteador._id} tiene: ${entries.length} entregas `
        );

        for (let entry of entries) {
          if (
            !entregas.find((x) => x._id.toString() === entry._id.toString())
          ) {
            entregas.push(entry);
          }
        }
      }
    }

    console.log("Filtrando socks en base al ruteador y tipo de entrega");

    //Una vez guardadas todas las entregas se deben filtrar conforme al ruteador y al tipo de entrega
    for (let ruteador of ruts) {
      //filtrar las entregas en base al id del ruteador
      const rutSocks = entregas.filter((x) =>
        x.ruteador
          ? x.ruteador.toString() === ruteador._id.toString()
          : x.backdoor.toString() === ruteador._id.toString()
      );

      const cobijas = rutSocks.filter((x) =>
        x.entrega
          ? x.entrega.toString() === COBIJAS
          : x.tipo === "Cobijas" || "Cobija"
      );
      const despensas = rutSocks.filter((x) =>
        x.entrega
          ? x.entrega.toString() === DESPENSA
          : x.tipo === "Despensas" || "Despensa"
      );

      const obj = {
        _id: ruteador._id.toString(),
        nombre: `${ruteador.nombre} ${ruteador.paterno} ${ruteador.materno}`,
        totalCobijas: cobijas.length,
        totalDespensas: despensas.length,
        totalEntregas: rutSocks.length,
      };

      if (rutSocks.length > 0) {
        rutsWithSocks.push(ruteador);
        result.push(obj);
      } else {
        rutsWithoutSocks.push(ruteador);
        result0.push(obj);
      }
    }

    console.log("Generando CSV");
    const date = new Date();
    const reportDate = `${date.getDate()}-${
      date.getMonth
    }-${date.getFullYear()}`;
    const fileName = `entregas_ruteadores-${reportDate}`;
    const fileName2 = `entregas_ruteadores_undefined-${reportDate}`;
    convertToPdf(result, fileName);
    convertToPdf(result0, fileName2);

    console.log("CSV generado");
    resolve();
  });
}

module.exports = lookRutSocks;
