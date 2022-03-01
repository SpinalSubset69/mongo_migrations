const mongoose = require("mongoose");

async function connectToDatabase(database_url) {
  await mongoose.connect(database_url);
}

module.exports = async (database_url) => {
  //Check theres a connection, then disconnect it
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    await connectToDatabase(database_url);
  } else {
    //Connect to database
    await connectToDatabase(database_url);
  }
};
