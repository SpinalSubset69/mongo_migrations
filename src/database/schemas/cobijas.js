const mongoose = require("mongoose");

const CobijasSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  ruteador: { type: mongoose.Schema.Types.ObjectId, ref: "ruteadores" },
  cobija: { type: Boolean },
  despensa: { type: Boolean },
  jugete: { type: Boolean },
});

module.exports = mongoose.model("cobijas", CobijasSchema);
