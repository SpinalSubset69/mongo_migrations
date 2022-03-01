const users = require("../database/schemas/users");
const makeHttpError = require("../helpers/httpError");

const controller = {
  getUsersFromDb: async (req, res) => {
    try {
      const list = await users.find();
      return res.status(200).json({ message: "Users", data: list });
    } catch (err) {
      await makeHttpError(err, res);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      await users.deleteOne({ _id: id });

      return res.status(200).json({ message: "User removed" });
    } catch (err) {
      await makeHttpError(err, res);
    }
  },
  getUser: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await users.findOne({ _id: id });

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ message: "User", data: user });
    } catch (err) {
      await makeHttpError(err, res);
    }
  },
};

module.exports = controller;
