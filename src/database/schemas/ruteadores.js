const mongoose = require("mongoose");

const RuteadoresSchema = new mongoose.Schema({
  rute: {
    type: String,
  },
  ciuadanos: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  ruteadores: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

module.exports = mongoose.model("ruteadores", RuteadoresSchema);
