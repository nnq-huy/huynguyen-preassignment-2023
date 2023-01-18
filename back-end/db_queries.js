const Pool = require("pg").Pool;
const cn = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.JOURNEYDB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
//initialize new db connection pool
const pool = new Pool(cn);

/* create stations + journeys table in postgres
Table stations has 5 columns: id, name, address, x, y
Table journeys has 9 columns: id, departure_time, return_time, departure_station_id, departure_station, return_station_id, return_station, distance, duration
*/
const initializeDB = (request, response) => {
  pool.query(
    "CREATE TABLE IF NOT EXISTS stations (id INTEGER PRIMARY KEY,name VARCHAR(255),address VARCHAR(255),x REAL,y REAL); CREATE TABLE IF NOT EXISTS journeys (id SERIAL PRIMARY KEY, departure_time TIMESTAMP, return_time TIMESTAMP,departure_station_id INTEGER, departure_station VARCHAR(255), return_station_id INTEGER, return_station VARCHAR(255), distance REAL, duration REAL)",
    (error, result) => {
      if (error) {
        throw response.status(405).send(error);
      }
      response
        .status(201)
        .send("Tables successfully created. / Tables existed.");
    }
  );
};

//get all the stations, return a json list ordered by id
const getStations = (request, response) => {
  pool.query("SELECT * FROM stations ORDER by id", (error, results) => {
    if (error) {
      throw response.status(404).send("Data not found");
    }
    response.status(200).json(results.rows);
  });
};

//get all journeys starting from a station
const getJourneysByDepartureStation = (request, response) => {
  const departure_station_id = request.params.dep_station_id;
  pool.query(
    "SELECT * FROM journeys WHERE departure_station_id=$1",
    [departure_station_id],
    (error, results) => {
      if (error) {
        throw response.status(404).send("Data not found");
      }
      response.status(200).json(results.rows);
    }
  );
};

//get all journeys ending at a station
const getJourneysByReturnStation = (request, response) => {
  const return_station_id = request.params.return_station_id;
  pool.query(
    "SELECT * FROM journeys WHERE return_station_id=$1",
    [return_station_id],
    (error, results) => {
      if (error) {
        throw response.status(404).send("Data not found");
      }
      response.status(200).json(results.rows);
    }
  );
};

//count the number of trips starting & ending from a station, return a json object with departure_count & return_count
const countJourneyByStation = (request, response) => {
  const station_id = request.params.station_id;
  pool.query(
    "SELECT SUM(CASE WHEN departure_station_id = $1 THEN 1 ELSE 0 END) as departure_count, SUM(CASE WHEN return_station_id = $1 THEN 1 ELSE 0 END) as return_count FROM journeys",
    [station_id],
    (error, result) => {
      if (error) {
        throw response.status(404).send("Data not found");
      }
      response.status(200).json(result.rows);
    }
  );
};

module.exports = {
  initializeDB,
  getStations,
  getJourneysByDepartureStation,
  getJourneysByReturnStation,
  countJourneyByStation,
};
