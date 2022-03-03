const lookCobijas = require("./helpers/lookCobijas");
const lookRutSocks = require("./helpers/lookRutSocks");
const mergeDatabaseDocker = require("./helpers/mergeDatabaseDocker");
const mergeRegistros = require("./helpers/mergeRegistros");
const saveBienes = require("./helpers/saveBienes");
const saveEntregas = require("./helpers/saveEntregas");
const saveRuteadores = require("./helpers/saveRuteadores");
const saveSocks = require("./helpers/saveSocks");
const saveUsers = require("./helpers/saveUsers");

/* (async function main() {
  try {
    await mergeDatabaseDocker();
    await saveBienes();
    await saveEntregas();
    await mergeRegistros();
    await saveRuteadores();
    await saveSocks();
    await saveUsers();
    console.log("Program Ended");
  } catch (ex) {
    console.log(ex.message.toString().red);
  }
})(); */

(async function main() {
  try {
    //await mergeDatabaseDocker();
    //await lookCobijas();
    await lookRutSocks();
    console.log("Program Ended");
  } catch (ex) {
    console.log(ex.message.toString().red);
  }
})();
