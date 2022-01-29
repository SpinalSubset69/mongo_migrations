const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  nombre: { type: String },
  materno: { type: String },
  paterno: { type: String },
  direccion: { type: String },
  telefono: { type: String },
  curp: { type: String },
  sexo: { type: String },
  password: { type: String },
  folio: { type: String },
  dependienteEconomico: { type: String },
  rol: { type: String },
});

module.exports = mongoose.model("users", UsersSchema);
