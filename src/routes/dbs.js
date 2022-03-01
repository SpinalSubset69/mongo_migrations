const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.get("/users", userController.getUsersFromDb);

module.exports = router;
