const { Router } = require("express");

const upload = require("../controllers/file_upload");
const db = require("../controllers/db_queries");
const { pushCsvToDb } = require("../controllers/csv_to_db");
const router = Router();

router.get("/", (request, response) => {
  response.json({
    info: "Back-end running on Node.js, Express, and PostgresSQL",
  });
});
router.get("/exit", (request, response) => {
  response.send("Exiting NodeJS server");
  console.log("Exiting NodeJS server");
  process.exit();
});
//csv file upload route: stations or journeys
router.post(
  "/upload/:uploadType",
  upload.uploadFile.single("file"),
  upload.uploadCsv
);

//csv file parsing route
router.post("/csv/:importType", pushCsvToDb);

//db queries routes:
//create stations and journeys if not existed
router.post("/db", db.initializeDB);
//get all stations
router.get("/stations", db.getStations);
//get all journeys, limit 100000
router.get("/journeys", db.getJourneys);
//get station infos
router.get("/station/id=:station_id", db.getStationInfo);
//get all journeys starting at a station
router.get(
  "/journeys/departure=:departure_station_id",
  db.getJourneysByDepartureStation
);
//get all journeys ending at a station
router.get(
  "/journeys/return=:return_station_id",
  db.getJourneysByReturnStation
);
//create new journey based on json object from request body
router.post("/journeys/new", db.createJourney);
//create new station based on json object from request body
router.post("/stations/new", db.createStation);

module.exports = router;
