const fs = require("fs");
const json2xls = require("json2xls");

function convertToPdf(data, name) {
  const fileName = `${name}.xlsx`;
  const xls = json2xls(data);

  fs.writeFileSync(fileName, xls, "binary", (err) => {
    if (err) console.log(err);
    console.log("File saved");
  });
}

module.exports = convertToPdf;
