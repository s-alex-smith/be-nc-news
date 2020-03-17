const knex = require("../connection");

exports.selectAllTopics = () => {
  return knex
    .select("*")
    .from("topics")
    .returning("*")
    .then(topic => {
      return topic;
    });
};
