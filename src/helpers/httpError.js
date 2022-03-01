const logEvents = require("./logger");

async function makeHttpError(err, res) {
  await logEvents(err.message);
  return res.status(500).json({ message: "Error", error: err.message });
}

module.exports = makeHttpError;
