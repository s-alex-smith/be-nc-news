const knex = require("../connection");

exports.selectUserById = username => {
  return knex
    .select("*")
    .from("users")
    .modify(queryBuilder => {
      if (username !== undefined) {
        return queryBuilder.where("username", "=", username);
      }
    })
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Not found"
        });
      } else {
        return result;
      }
    });
};
