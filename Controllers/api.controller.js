const { selectEndpoints } = require("../Models/api.model");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints()
    .then(data => {
      res.send({ data });
    })
    .catch(next);
};
