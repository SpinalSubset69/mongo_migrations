const mongoose = require("mongoose");

async function disconnectDb() {
  await mongoose.connection.close();
}

module.exports = disconnectDb;
