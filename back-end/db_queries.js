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
    name: "a",
    address: "a",
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
  const queries = [
    query_basic_info,
    query_count_journeys,
    query_avg_starting_dist,
    query_avg_ending_dist,
  ];

  try {
    for (let i = 0; i < queries.length; i++) {
      const result = await client.query(queries[i]);
      station = { ...station, ...result.rows[0] };
    }
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
  response.status(200).json(station);
};
//create new journey based on json object from request body
const createJourney = async (request, response) => {
  const client = await pool.connect();
  const {
    departure_time,
    return_time,
    depparture_station_id,
    depparture_station,
    return_station_id,
    return_station,
    distance,
    duration,
  } = request.body;
  const query = {
    text: "INSERT INTO journeys ( departure_time, return_time, depparture_station_id, depparture_station, return_station_id, return_station, distance, duration,) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    values: [
      departure_time,
      return_time,
      depparture_station_id,
      depparture_station,
      return_station_id,
      return_station,
      distance,
      duration,
    ],
  };
  try {
    const results = await client.query(query);
    response.status(201).send("Journey added with ID:" + results.rows[0].id);
  } catch (err) {
    response.status(405).send("Cannot add a new entry" + err);
  } finally {
    client.release();
  }
};
//create new station based on json object from request body
const createStation = async (request, response) => {
  const client = await pool.connect();
  const { id, name, address, x, y } = request.body;
  const query = {
    text: "INSERT INTO stations ( id, name, address, x, y) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    values: [id, name, address, x, y],
  };
  try {
    const results = await client.query(query);
    response.status(201).send("Station added with ID:" + results.rows[0].id);
  } catch (err) {
    response.status(405).send("Cannot add a new entry" + err);
  } finally {
    client.release();
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
};
