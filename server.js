const express = require("express");
require("dotenv").config();
const app = express();

app.get("/", (req, res) => {
  res.status(200);
  res.send("Hello from the github server 👋");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});
