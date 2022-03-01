const config = require("../config");
const ruteadores = require("../database/schemas/ruteadores");
const socks = require("../database/schemas/socks");
const users = require("../database/schemas/users");
const connect_to_database = require("./../database/index");
const { COBIJAS, DESPENSA } = require("./constatns");
const fs = require("fs");
const logEvents = require("./logger");
const path = require("path");
const fsPromises = require("fs").promises;

function lookRutSocks() {
  return new Promise(async (resolve) => {
    //Buscar cuantas entregas ha hecho cada ruteador
    const ruts = []; //Array para almacenar la información
    const entregas = [];
    let result = [];
    let result0 = [];
    let content =
      "_id:\tNombre\tTotal Cobijas\tTotal Despensas\tTotal Entregas\n";
    let content0 =
      "_id:\tNombre\tTotal Cobijas\tTotal Despensas\tTotal Entregas\n";
    const rutsWithSocks = [];
    const rutsWithoutSocks = [];
    const keys = Object.entries(config);
    console.log("Buscando Ruteadores en cada base de datos");

    for (let key of keys) {
      if (key[1].length > 10 && key[0] != "objective_db") {
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
    }

    console.log(ruts);

    console.log("Buscando entregas de cada ruteador");
    for (let ruteador of ruts) {
      //Se debe buscar en cada base de datos cuantos socks tiene este ruteador
      const keys = Object.entries(config);
      for (let key of keys) {
        if (key[1].length > 10 && key[0] != "objective_db") {
          //Conectarse a db
          await connect_to_database(key[1]);

          //Se buscara en todos los socks cuales son del ruteador
          const entries = await socks.find({ ruteador: ruteador._id });
          console.log(
            `Ruteador: ${ruteador._id} tiene: ${entries.length} entregas en la base de datos: ${key[0]}`
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
    }

    console.log("Filtrando socks en base al ruteador y tipo de entrega");

    //Una vez guardadas todas las entregas se deben filtrar conforme al ruteador y al tipo de entrega
    for (let ruteador of ruts) {
      //filtrar las entregas en base al id del ruteador
      const rutSocks = entregas.filter(
        (x) => x.ruteador.toString() === ruteador._id.toString()
      );

      const cobijas = rutSocks.filter((x) => x.entrega.toString() === COBIJAS);
      const despensas = rutSocks.filter(
        (x) => x.entrega.toString() === DESPENSA
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
        content += `${ruteador._id}\t${ruteador.nombre} ${ruteador.paterno} ${ruteador.materno}\t${cobijas.length}\t${despensas.length}\t${rutSocks.length}\n`;
      } else {
        rutsWithoutSocks.push(ruteador);
        result0.push(obj);
        content0 += `${ruteador._id}\t${ruteador.nombre} ${ruteador.paterno} ${ruteador.materno}\t${cobijas.length}\t${despensas.length}\t${rutSocks.length}\n`;
      }
    }

    console.log(`\t\tRuteadores con Entregas`);
    console.table(result);

    console.log(
      "------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n\n\n"
    );

    console.log(`\t\tRuteadores sin Entregas`);
    console.table(result0);

    console.log("Generando txt");

    const basePath = path.join(__dirname, "../logs");
    try {
      if (!fs.existsSync(basePath)) {
        await fsPromises.mkdir(basePath);
      }
      await fsPromises.appendFile(
        path.join(basePath, "ruteadoresWithSocks.txt"),
        content
      );

      await fsPromises.appendFile(
        path.join(basePath, "ruteadoresWithoutSocks.txt"),
        content0
      );
    } catch (err) {
      logEvents(err.message);
    }

    //SE DEBEN GUARDAR LAS ENTREGAS PARA VERIFICAR QUE ESTEN TODAS COMPLETAS, ademas de los ruteadores
    console.log("\n\nGuardando socks y ruteadores");
    await connect_to_database(config.objective_db);
    for (let ruteador of rutsWithSocks) {
      const exists = await users.exists({ _id: ruteador._id });

      if (!exists) {
        //Verificar en los ruteadores sin entregas ambos datos

        const rut = rutsWithoutSocks.filter(
          (x) => x.nombre === ruteador.nombre
        )[0];

        if (rut) {
          if (!ruteador.email) ruteador.email = rut.email;
          if (!ruteador.fijo) ruteador.fijo = rut.fijo;
          if (!ruteador.direccion) ruteador.fijo = rut.direccion;
          if (!ruteador.edad) ruteador.fijo = rut.edad;
        }

        await users.insertMany(ruteador);
      }
    }

    for (let entrega of entregas) {
      const exists = await socks.exists({ _id: entrega._id });

      if (!exists) {
        await socks.insertMany(entrega);
      }
    }

    resolve();
  });
}

module.exports = lookRutSocks;
