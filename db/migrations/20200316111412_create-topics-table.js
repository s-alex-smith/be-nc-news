exports.up = function(knex) {
  console.log("creating a table");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable.string("slug").primary();
    topicsTable.string("description");
  });
};

exports.down = function(knex) {
  console.log("dropping a table");
  return knex.schema.dropTable("topics");
};
