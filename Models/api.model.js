const { readFile } = require("fs").promises;

exports.selectEndpoints = () => {
  return readFile("./endpoints.json", "utf8").then(result => {
    return result;
  });
};
