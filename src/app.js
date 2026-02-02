const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`ben 10 api is running}`);
});

module.exports = app;
