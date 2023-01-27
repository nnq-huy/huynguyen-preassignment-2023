const Pool = require("pg").Pool;
//postgres connection detail from .env file
const cn = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.JOURNEYDB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
//initialize new db connection pool
const pool = new Pool(cn);
/* the pool will emit an error on behalf of any idle clients
it contains if a backend error or network partition happens */
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
/* create stations + journeys table in postgres
Table stations has 5 columns: id, name, address, x, y
Table journeys has 9 columns: id, departure_time, return_time, departure_station_id, departure_station, return_station_id, return_station, distance, duration
*/
const initializeDB = async (request, response) => {
  const client = await pool.connect();
  try {
    const results = await client.query(
      "CREATE TABLE IF NOT EXISTS stations (id INTEGER PRIMARY KEY,name VARCHAR(255),address VARCHAR(255),x REAL,y REAL); CREATE TABLE IF NOT EXISTS journeys (id SERIAL PRIMARY KEY, departure_time TIMESTAMP, return_time TIMESTAMP,departure_station_id INTEGER, departure_station VARCHAR(255), return_station_id INTEGER, return_station VARCHAR(255), distance REAL, duration REAL)"
    );
    response.status(201).send("Tables successfully created. / Tables existed.");
  } catch (err) {
    response.status(405).send(err);
  } finally {
    client.release();
  }
};

//get all the stations, return a json list ordered by id
const getStations = async (request, response) => {
  const client = await pool.connect();
  try {
    const results = await client.query("SELECT * FROM stations ORDER by id");
    response.status(200).json(results.rows);
  } catch (err) {
    response.status(404).send("Data not found");
  } finally {
    client.release();
  }
};
//get all journeys: limit 1000
const getJourneys = async (request, response) => {
  const client = await pool.connect();
  try {
    const results = await client.query(
      "SELECT id, departure_station, return_station, distance, duration FROM journeys LIMIT 100000"
    );
    response.status(200).json(results.rows);
  } catch (err) {
    response.status(404).send("Data not found");
  } finally {
    client.release();
  }
};
//get all journeys starting from a station
const getJourneysByDepartureStation = async (request, response) => {
  const departure_station_id = request.params.departure_station_id;
  const client = await pool.connect();
  try {
    const results = await client.query(
      "SELECT * FROM journeys WHERE departure_station_id=$1 ORDER by departure_time",
      [departure_station_id]
    );
    response.status(200).json(results.rows);
  } catch (err) {
    response.status(404).send("Data not found: " + err);
  } finally {
    client.release();
  }
};
//get all journeys ending at a station
const getJourneysByReturnStation = async (request, response) => {
  const return_station_id = request.params.return_station_id;
  const client = await pool.connect();
  try {
    const results = await client.query(
      "SELECT * FROM journeys WHERE return_station_id=$1 ORDER by return_time",
      [return_station_id]
    );
    response.status(200).json(results.rows);
  } catch (err) {
    response.status(404).send("Data not found: " + err);
  } finally {
    client.release();
  }
};

/* get all information for a station: name, address, lat,long, total number of journeys starting/ending from the station,
average distance of a starting/ending journey, 5 most popular return/departure stations for journeys starting/ending from the station
*/
const getStationInfo = async (request, response) => {
  const station_id = request.params.station_id;
  const client = await pool.connect();
  let station = {
    id: 0,
    name: "",
    address: "",
    x: 0.0,
    y: 0.0,
    departure_count: 0,
    return_count: 0,
    avg_starting_dist: 0,
    avg_ending_dist: 0,
    most_popular_return: [],
    most_popular_departure: [],
  };
  const query_basic_info = {
    text: "SELECT * FROM stations WHERE id = $1",
    values: [station_id],
  };
  const query_avg_starting_dist = {
    text: "SELECT AVG(distance) as avg_starting_dist FROM journeys WHERE departure_station_id = $1",
    values: [station_id],
  };
  const query_avg_ending_dist = {
    text: "SELECT AVG(distance) as avg_ending_dist FROM journeys WHERE return_station_id = $1",
    values: [station_id],
  };
  const query_count_journeys = {
    text: "SELECT SUM(CASE WHEN departure_station_id = $1 THEN 1 ELSE 0 END) as departure_count, SUM(CASE WHEN return_station_id = $1 THEN 1 ELSE 0 END) as return_count FROM journeys",
    values: [station_id],
  };
  const query_five_most_popular_ending_stations = {
    text: "SELECT return_station, COUNT(*) as count FROM journeys WHERE departure_station_id = $1 GROUP BY return_station ORDER BY count DESC LIMIT 5;",
    values: [station_id],
  };
  const query_five_most_popular_starting_stations = {
    text: "SELECT departure_station, COUNT(*) as count FROM journeys WHERE return_station_id = $1 GROUP BY departure_station ORDER BY count DESC LIMIT 5;",
    values: [station_id],
  };
  const queries = [
    query_basic_info,
    query_count_journeys,
    query_avg_starting_dist,
    query_avg_ending_dist,
  ];

  try {
    for (let i = 0; i < queries.length; i++) {
      try {
        const result = await client.query(queries[i]);
        station = { ...station, ...result.rows[0] };
      } catch (err) {
        throw err;
      }
    }
    const result_ending = await client.query(
      query_five_most_popular_ending_stations
    );
    const result_starting = await client.query(
      query_five_most_popular_starting_stations
    );
    station = {
      ...station,
      most_popular_departure: result_starting.rows,
      most_popular_return: result_ending.rows,
    };
    station.id > 0
      ? response.status(200).json(station)
      : response.status(404).send("Station not found!");
  } catch (err) {
    response.status(400).send("Error " + err);
  } finally {
    client.release();
  }
};
/* Journey data validation:
    1. Departure time is parsable
    2. Return time is parsable & greater than departure time
    3. Station id is a positive integer
    4. Distance and duration is greater than 10(m or s)
    */
const journeyValidation = (
  departure_time,
  return_time,
  departure_station_id,
  departure_station,
  return_station_id,
  return_station,
  distance,
  duration
) => {
  const isDepartureValid = Date.parse(departure_time) !== null;
  const isReturnValid =
    Date.parse(return_time) !== null &&
    Date.parse(return_time) > Date.parse(departure_time);
  const isIdValid = departure_station_id > 0 && return_station_id > 0;
  const isDurationDistanceValid = distance >= 10 && duration >= 10;
  const isStationsValid = departure_station != "" && return_station != "";
  return (
    isDepartureValid &&
    isIdValid &&
    isReturnValid &&
    isDurationDistanceValid &&
    isStationsValid
  );
};
//create new journey based on json object from request body
const createJourney = async (request, response) => {
  const client = await pool.connect();
  const {
    departure_time,
    return_time,
    departure_station_id,
    departure_station,
    return_station_id,
    return_station,
    distance,
    duration,
  } = request.body;
  const isJourneyValid = journeyValidation(
    departure_time,
    return_time,
    departure_station_id,
    departure_station,
    return_station_id,
    return_station,
    distance,
    duration
  );
  const query = {
    text: "INSERT INTO journeys ( departure_time, return_time, departure_station_id, departure_station, return_station_id, return_station, distance, duration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    values: [
      departure_time,
      return_time,
      departure_station_id,
      departure_station,
      return_station_id,
      return_station,
      distance,
      duration,
    ],
  };
  if (isJourneyValid) {
    try {
      const results = await client.query(query);
      response.status(201).send("Journey added with ID:" + results.rows[0].id);
    } catch (err) {
      response.status(405).send("Cannot add a new entry" + err);
    } finally {
      client.release();
    }
  } else {
    response.status(405).send("Cannot add a new entry: invalid data");
  }
};
//station validation: id is greater than zero and latitude/longitude is within finland's limit
const stationValidation=(id, name, address, x, y) =>{
  const isLatLongValid = !(21.37 > x || x > 30.94 || 59.83 > y || y > 68.91);
  return Number.isInteger(id)&&id > 0 && name != "" && address != "" && isLatLongValid;
}
//create new station based on json object from request body
const createStation = async (request, response) => {
  const client = await pool.connect();
  const { id, name, address, x, y } = request.body;
  const query = {
    text: "INSERT INTO stations ( id, name, address, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    values: [id, name, address, x, y],
  };
  const isStationValid = stationValidation(id, name, address, x, y);
  if (isStationValid) {
    try {
      const results = await client.query(query);
      response.status(201).send("Station added with ID: " + results.rows[0].id);
    } catch (err) {
      response.status(405).send("Cannot add a new entry! " + err);
    } finally {
      client.release();
    }
  } else {
    response.status(405).send("Cannot add a new entry: station data invalid");
  }
};
module.exports = {
  createJourney,
  createStation,
  initializeDB,
  getStations,
  getJourneys,
  getStationInfo,
  getJourneysByDepartureStation,
  getJourneysByReturnStation,
  journeyValidation,
  stationValidation,
};
