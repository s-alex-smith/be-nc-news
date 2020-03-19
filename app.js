const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ message: "Bad request" });
  } else {
    res.status(400).send({ message: "Value does not exist" });
  }
});

module.exports = app;
