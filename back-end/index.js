const express = require("express");
const bodyParser = require("body-parser");

const upload = require("./file_upload.js");
const db = require("./db_queries");
const { pushCsvToDb } = require("./csv_to_db.js");


require("dotenv").config();

//express init
const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//back-end main route
app.get("/", (request, response) => {
  response.json({
    info: "Back-end running on Node.js, Express, and PostgresSQL",
  });
});

//csv file upload route: stations or journeys
app.post("/upload/:uploadType", upload.uploadFile.single('file'),upload.uploadCsv);

//csv file parsing route
app.post("/csv/:importType", pushCsvToDb)
//db queries routes
app.post("/db",db.initializeDB);


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}. Go to http://localhost:3000/`);
});
