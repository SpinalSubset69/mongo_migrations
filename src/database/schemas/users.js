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
  folioCobijas: { type: String },
  dependienteEconomico: { type: String },
  rol: { type: String },
  fechanacimiento: { type: String },
  edad: { type: String },
  email: { type: String },
  fijo: { type: String },
  fotografia: { type: String },
  nip: { type: String },
  ruta: { type: String },
});

module.exports = mongoose.model("users", UsersSchema);
