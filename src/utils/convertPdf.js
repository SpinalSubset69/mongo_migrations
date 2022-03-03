const fs = require("fs");
const json2xls = require("json2xls");
const path = require("path");

function convertToPdf(data, name) {
  const fileName = `${name}.xlsx`;
  const xls = json2xls(data);
  const basePath = path.join(__dirname, "../reports");

  fs.writeFileSync(path.join(basePath, fileName), xls, "binary", (err) => {
    if (err) console.log(err);
    console.log("File saved");
  });
}

module.exports = convertToPdf;
