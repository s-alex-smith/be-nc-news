const customConfig = require("./knexfile");
const knex = require("knex");
const client = knex(customConfig);

module.exports = client;
