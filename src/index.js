const mergeDatabaseDocker = require("./helpers/mergeDatabaseDocker");
const saveSocks = require("./helpers/saveSocks");

(async function main() {
  try {
    await mergeDatabaseDocker();
    await saveSocks();
    console.log("Program Ended");
  } catch (ex) {
    console.log(ex.message.toString().red);
  }
})();

/* const config = require("./config");
const app = require("./app");
require("./database/connect");

const port = config.port;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
 */
