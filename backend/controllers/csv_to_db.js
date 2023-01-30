/* Handle csv parsing and importing to Posgres db
using fast-csv as csv file parser and pg-promise as bulk db transaction handler */

const fs = require("fs");
const fastcsv = require("fast-csv");
const pgp = require("pg-promise")({ capSQL: true });

//postgres connection details
const cn = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
const journeyImportQuery =
  "INSERT INTO journeys (departure_time, return_time, departure_station_id, departure_station, return_station_id, return_station, distance, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
const stationImportQuery =
  "INSERT INTO stations(id,name,address,x,y) VALUES ($1, $2, $3, $4, $5)";
const tripHeaders = [
  "departure_time",
  "return_time",
  "departure_station_id",
  "departure_station",
  "return_station_id",
  "return_station",
  "distance",
  "duration",
];

//function for bulk db import, takes csvResult as array of data from parsed csv file, and a PostgresSQL query as arguments
async function dbImport(csvResult, query) {
  //initialize db connection
  const db = pgp(cn);
  //import loop
  function factory(index) {
    qLength = csvResult.length;
    if (index < qLength) {
      //console.log("record " + (index + 1) + " of " + qLength + " imported.");
      return this.query(query, csvResult[index]);
    }
  }
  //mass transaction execution
  await db
    .tx(function () {
      return this.sequence(factory);
    })
    .then(function (data) {
      // success;
      //console.log("import complete ");
      //end db connection
      pgp.end();
    })
    .catch(function (error) {
      // error;
      throw error;
    });
}

const parseJourneys = () => {
  let tripStream = fs.createReadStream("./csv/journeys.csv");
  //array that holds parsed csv data
  let csvData = [];
  //csv data stream from file
  let csvStream = fastcsv
    .parse({
      headers: tripHeaders,
      renameHeaders: true,
      delimiter: ",",
      quote: '"',
    })
    /* Journey data validation:
    1. Departure time is parsable
    2. Return time is parsable & greater than departure time
    3. Station id is a positive integer
    4. Distance and duration is greater than 10(m or s)
    */
    .validate((row, cb) => {
      const isDepartureValid = Date.parse(row.departure_time) !== null;
      const isReturnValid =
        Date.parse(row.return_time) !== null &&
        Date.parse(row.return_time) > Date.parse(row.departure_time);
      const isIdValid =
        row.departure_station_id > 0 && row.return_station_id > 0;
      const isDurationDistanceValid = row.distance >= 10 && row.duration >= 10;
      if (!(isDepartureValid && isReturnValid)) {
        return cb(null, false, "Invalid departure/return time!");
      }
      if (!isIdValid) {
        return cb(null, false, "Invalid Id!");
      }
      if (!isDurationDistanceValid) {
        return cb(null, false, "Invalid duration/distance!");
      }
      return cb(null, true);
    })
    .on("error", (error) => console.log(error))
    .on("data", function (data) {
      //convert object to array for db transaction
      csvData.push(Object.values(data));
    })
    .on("data-invalid", (row, rowNumber, reason) =>
      console.log(
        `Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(
          row
        )}] [reason=${reason}]`
      )
    )
    //.on("end", (rowCount) => console.log("Parsed " + rowCount + " rows"));

  tripStream ? tripStream.pipe(csvStream) : () => {}; //check if file stream is not null and parse csv data
  return csvData;
};

const parseStations = () => {
  let stationStream = fs.createReadStream("./csv/stations.csv");
  //array that holds parsed csv data, redundant fields are omitted
  let csvData = [];
  let csvStream = fastcsv
    .parse({
      headers: [
        undefined,
        "id",
        "name",
        undefined,
        undefined,
        "address",
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "x",
        "y",
      ],
      renameHeaders: true,
      delimiter: ",",
      quote: '"',
    })
    .on("error", (error) => console.log(error))
    .validate((row) => (Number.isInteger(row.id)&&row.id > 0 && row.name != "" && row.address != "" &&!(21.37 > row.x || row.x > 30.94 || 59.83 > row.y || row.y > 68.91))) //validate finland's lat, long limit
    .on("data", function (data) {
      //convert object to array for db transaction
      csvData.push(Object.values(data));
    })
    //.on("end", (rowCount) => console.log("Parsed " + rowCount + " rows"));

    stationStream ? stationStream.pipe(csvStream) : () => {}; //check if file stream is not null and parse csv data
  return csvData;
};

const pushCsvToDb = async (request, response) => {
  const importType = request.params.importType;
  if (importType == "journeys") {
    try {
      await dbImport(parseJourneys(), journeyImportQuery);
      response.status(200).send("Import complete.");
    } catch (e) {
      response.status(400).send(e);
    }
  } else if (importType == "stations") {
    try {
      await dbImport(parseStations(), stationImportQuery);
      response.status(200).send("Import complete.");
    } catch (e) {
      response.status(400).send(e);
    }
  } else {
    response.status(400).send("Invalid request!");
  }
};

module.exports = { pushCsvToDb };
