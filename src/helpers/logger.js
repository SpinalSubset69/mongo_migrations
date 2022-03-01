const path = require("path");
const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = async (message) => {
  const dateTime = `${format(new Date(), "yyyy/MM/dd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  const basePath = path.join(__dirname, "../logs");

  try {
    //Crear directorio si no existe
    if (!fs.existsSync(basePath)) {
      await fsPromises.mkdir(basePath);
    }

    await fsPromises.appendFile(path.join(basePath, "logs.txt"), `${logItem}`);
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = logEvents;
