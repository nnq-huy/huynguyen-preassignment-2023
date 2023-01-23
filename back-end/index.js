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
app.get("/exit",(request, response)=>{
  response.send("Exiting NodeJS server");
  console.log("Exiting NodeJS server");
    process.exit();
})
//csv file upload route: stations or journeys
app.post("/upload/:uploadType", upload.uploadFile.single('file'),upload.uploadCsv);

//csv file parsing route
app.post("/csv/:importType", pushCsvToDb)

//db queries routes:
app.post("/db",db.initializeDB);
app.get("/stations",db.getStations);//get all stations
app.get("/journeys",db.getJourneys);//get all journeys
app.get("/station/id=:station_id",db.getStationInfo)//get station infos
app.get("/journeys/departure=:departure_station_id", db.getJourneysByDepartureStation); //get all journeys starting at a station
app.get("/journeys/return=:return_station_id", db.getJourneysByReturnStation);//get all journeys ending at a station
app.post("/journeys/new",db.createJourney);//create new journey based on json object from request body
app.post("/stations/new",db.createStation);//create new station based on json object from request body


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}. Go to http://localhost:3000/`);
});
