const users = require("../database/schemas/users");
const colors = require("colors");
const socks = require("../database/schemas/socks");
const ruteadores = require("../database/schemas/ruteadores");
const bienes = require("../database/schemas/bienes");
const entregas = require("../database/schemas/entregas");

async function Users(users_becal, users_en_uso) {
  console.log("Users in becal:".green, users_becal.length);
  console.log("Users in Uso:".green, users_en_uso.length);

  const arraysConcat = users_becal.concat(users_en_uso);

  await saveUsers(arraysConcat);

  console.log("Users Sorted".green);
  /* await users.insertMany(newArray); */
  console.log("Users Saved".green);
}

async function Socks(data) {
  await socks.insertMany(data);
  console.log("Socks Saved".green);
}

async function Ruteadors(data) {
  await ruteadores.insertMany(data);
  console.log("Ruteadores Saved".green);
}

async function Bienes(data) {
  await bienes.insertMany(data);
  console.log("Bienes Saved".green);
}

async function Entregas(data) {
  await entregas.insertMany(data);
  console.log("Users Saved".green);
}

module.exports = {
  Users,
  Bienes,
  Socks,
  Entregas,
  Ruteadors,
};

async function saveUsers(array) {
  let newArray = [];

  array.forEach(async (user) => {
    const exists = await users.exists(user._id);
    if (!exists) {
      newArray.push(user);
    }
  });

  await users.insertMany(newArray);  
}
