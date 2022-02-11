const mongoose = require("mongoose");

const RuteadoresSchema = new mongoose.Schema({
  ruta: {
    type: String,
  },
  ciudadanos: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  ruteadores: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

module.exports = mongoose.model("ruteadores", RuteadoresSchema);
