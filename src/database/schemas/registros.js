const mongoose = require("mongoose");

const RegistrosSchema = new mongoose.Schema({
  cantidad: {
    type: Number,
  },
  ciudadano: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  ruteador: { type: mongoose.Schema.Types.ObjectId, ref: "ruteadores" },
  biene: { type: mongoose.Schema.Types.ObjectId, ref: "bienes" },
  entrega: { type: mongoose.Schema.Types.ObjectId, ref: "entregas" },
});

module.exports = mongoose.model("registros", RegistrosSchema);
