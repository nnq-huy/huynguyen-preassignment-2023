require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const routes = require("./routes");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors())

app.use(routes);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}. Go to http://localhost:3000/`);
});

module.exports = app;