const express = require("express");
const app = express();
const cors = require("cors");
const dbsRoutes = require("./routes/dbs");

//Midlewares
app.use(cors());
app.use(express.json());

//Routes
app.use("/api", dbsRoutes);

module.exports = app;
