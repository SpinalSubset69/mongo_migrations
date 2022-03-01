const mongoose = require("mongoose");

const SocksSchema = new mongoose.Schema({
  cantidad: {
    type: Number,
  },
  ciudadano: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  ruteador: { type: mongoose.Schema.Types.ObjectId, ref: "ruteadores" },
  backdoor: { type: mongoose.Schema.Types.ObjectId, ref: "ruteadores" },
  biene: { type: mongoose.Schema.Types.ObjectId, ref: "bienes" },
  entrega: { type: mongoose.Schema.Types.ObjectId, ref: "entregas" },
  tipo: { type: String },
  created_at: { type: Date },
});

module.exports = mongoose.model("socks", SocksSchema);
