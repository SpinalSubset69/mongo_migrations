const mongoose = require("mongoose");
const bienes = require("./bienes");

const EntregasSchema = new mongoose.Schema({
  nombre: {
    type: String,
  },
  biene: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bienes",
    },
  ],
});

module.exports = mongoose.model("entregas", EntregasSchema);
