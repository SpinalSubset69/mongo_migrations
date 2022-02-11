const mongoose = require("mongoose");
const colors = require("colors");

async function connectToDatabase(database_url, database) {
  await mongoose.connect(database_url);
  console.log(`Connected to database: `.green, database.blue);
}

module.exports = async (database_url) => {
  let databaseName = "";
  //Define databse name
  if (database_url.includes("hn_suck")) {
    databaseName = "Db En Uso";
  } else if (database_url.includes("olakease")) {
    databaseName = "Sistema Becal";
  } else {
    databaseName = "New Db";
  }

  //Check theres a connection, then disconnect it
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log(`Switching to database: `.green, databaseName.blue);
    await connectToDatabase(database_url, databaseName);
  } else {
    //Connect to database
    await connectToDatabase(database_url, databaseName);
  }
};
