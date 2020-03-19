const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  const PSQLcodes = ["23502", "42703", "22P02"];
  if (PSQLcodes.includes(err.code)) {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Not found" });
  } else {
    res.status(err.status).send({ message: err.message });
  }
});

module.exports = app;
