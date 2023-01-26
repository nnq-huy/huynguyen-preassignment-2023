//api integration tests:
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const request = require("supertest");
const app = require("../index");

describe("Post to initialize tables /db ", () => {
  it("should return success creating new tables:stations, journeys or they exist", async () => {
    const res = await request(app).post("/db");
    expect(res.statusCode).toEqual(201);
  });
});

describe("Post to start csv parser /csv/:importType", () => {
  it("should return error if csv types is not 'stations' or ' journeys'", async () => {
    const res = await request(app).post("/csv/station");
    expect(res.statusCode).toEqual(400);
  });
  it("should return error if csv types is  'stations' and csv contains existing stations'", async () => {
    const res = await request(app).post("/csv/stations");
    expect(res.statusCode).toEqual(400);
  });
  it("should return success if csv types is  'journeys' as csv parser already filtered out invalid csv data", async () => {
    const res = await request(app).post("/csv/journeys");
    expect(res.statusCode).toEqual(200);
  });
});

describe("POST /upload/:uploadType to upload file", () => {
  it("upload a file to back end and rename it to :uploadType", async () => {
    const res = await request(app)
      .post("/upload/any")
      .attach("file", "./tests/testfile.csv");
    expect(res.statusCode).toEqual(201);
    expect(res.body.fileName).toEqual("any.csv");
  });
  it("return error when file is missing from the request", async () => {
    const res = await request(app).post("/upload/any").attach("file", "");
    expect(res.statusCode).toEqual(400);
  });
});

describe("POST /journeys/new & /stations/new to create a new station/journey ", () => {
  it("create new journey based on a valid json object from request body", async () => {
    const randomId = 10000 + Math.round(Math.random() * 10000);
    const data = {
      id: randomId,
      name: "Test station",
      address: "test address",
      x: 1,
      y: 1,
    };
    const res = await request(app).post("/stations/new").send(data);

    expect(res.statusCode).toEqual(201);
  });

  it("return error when json data contains existing station id", async () => {
    const invalidData = {
      id: 1,
      name: "Test station",
      address: "test address",
      x: 1,
      y: 1,
    };
    const res = await request(app).post("/stations/new").send(invalidData);
    expect(res.statusCode).toEqual(405);
  });

  it("return error when no json data is being sent", async () => {
    const res = await request(app).post("/stations/new").send("");
    expect(res.statusCode).toEqual(405);
  });
});

describe("GET /stations", () => {
  it("should return an array of stations", async () => {
    const res = await request(app).get("/stations");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeTruthy();
  });
  it("should return station details of a existing station with valid id", async () => {
    const res = await request(app).get("/station/id=1");
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Kaivopuisto");
    expect(res.body.departure_count).toBeTruthy();
    expect(res.body.return_count).toBeTruthy();
    expect(res.body.avg_starting_dist).toBeTruthy();
    expect(res.body.avg_ending_dist).toBeTruthy();
    expect(res.body.most_popular_return).toBeTruthy();
    expect(res.body.most_popular_departure).toBeTruthy();
  });
  it("should return an error if station is not found", async () => {
    const res = await request(app).get("/station/id=99999");
    expect(res.statusCode).toEqual(404);

  });
  it("should throw error if id is not a valid integer", async () => {
    const res = await request(app).get("/station/id=a");
    expect(res.statusCode).toEqual(400);
  });
});

describe("GET /journeys", () => {
  it("should return an array of journeys", async () => {
    const res = await request(app).get("/journeys");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeTruthy();
  });
});

