const mongoose = require("mongoose");

const RegistrosSchema = new mongoose.Schema({
  ciudadano: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  ruteador: { type: mongoose.Schema.Types.ObjectId, ref: "ruteadores" },
  dependencia: [{ type: mongoose.Schema.Types.ObjectId, ref: "bienes" }],
  entrega: { type: mongoose.Schema.Types.ObjectId, ref: "entregas" },
});

module.exports = mongoose.model("registros", RegistrosSchema);
