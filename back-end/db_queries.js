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

module.exports={initializeDB}
