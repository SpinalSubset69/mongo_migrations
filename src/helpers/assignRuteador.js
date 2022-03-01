const users = require("../database/schemas/users");
const colors = require("colors");
const ruteadores = require("../database/schemas/ruteadores");
const { RUTEADOR } = require("./constatns");
const lookUserOnDbs = require("./lookUsrOnDbs");

//Se debe mandar llamar desues de guardar los datos en la db
function assignRuteador() {
  return new Promise(async (resolve) => {
    const data = await ruteadores.find();

    for (let ruteador of data) {
      //Si la ruta no tiene nombre se le asigna el nombre de 0
      if (!ruteador.ruta) ruteador.ruta = "0";
      // Si no hay ruteador asignado, asignar uno temporal
      if (ruteador.ruteadores.length === 0) {
        await ruteadores.findOneAndUpdate(
          { _id: ruteador._id },
          {
            $push: { ruteadores: RUTEADOR },
          }
        );
      }

      //Verificar que existan los ciudadanos en la base de datos
      for (let ciudadano of ruteador.ciudadanos) {
        const exists = await users.exists({ _id: ciudadano });
        if (!exists) {
          //Verificar mediante el curp si existe ya en la base de datos
          const userOnDb = await users.findOne({ curp: ciudadano.curp });

          if (userOnDb) {
            //Si el usuario ya esta en la base de datos, se debe verificar que pertenezca almenos a una ruta
            //De ser asi, se debe borrar el id de la ruta
            const userRoute = await ruteadores.findOne({
              ciudadanos: userOnDb._id,
            });

            if (userRoute) {
              //El ciudadano ya esta en la base de datos, pero no ha sido removido de las rutas
              //Se debe remover de la ruta
              await ruteadores.findOneAndUpdate(
                { _id: ruteador._id },
                {
                  $pull: { ciudadanos: ciudadano._id },
                }
              );
              console.log(
                `User: ${ciudadano._id} fue eliminado de la ruta: ${ruteador._id}`
              );
            }
          }
          //En caso de no existir en la base de datos, imprimir el id
          /* console.log(
            `Ciudadano: ${ciudadano._id} no existe en la base de datos, se debe buscar en las demas bases de datos`
          ); */
          //TODO: Metodo para buscar el usuario faltante en las demas bases de datos
          //Puede ser muy exahustivo, limitar a la ultima base de datos, en caso de existir se debe verificar tambien los socks del usuario en las demas dbs
          await lookUserOnDbs(ciudadano._id);
        }
      }
    }
    resolve();
  });
}

module.exports = assignRuteador;
