const ENV = process.env.NODE_ENV || "development";
const knex = require("knex");

const dbConfig =
  ENV === "production"
    ? { client: "pg", connection: process.env.DATABASE_URL }
    : require("./knexfile");

module.exports = knex(dbConfig);

// const customConfig = require("./knexfile");
// const knex = require("knex");
// const client = knex(customConfig);

// module.exports = client;
