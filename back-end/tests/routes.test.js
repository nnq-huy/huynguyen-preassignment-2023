require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const request = require("supertest");
const express = require("express");
const routes = require("../routes");

const app = express();
app.use(express.json());
app.use(routes);


describe("Initialize tables", () => {
  it("should return success creating new tables:stations, journeys or they exist", async () => {
    const res = await request(app).post("/db");
    expect(res.statusCode).toEqual(201);
  });
});

describe("Post to start csv parser", () => {
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

describe("File upload endpoint", () => {
  it("upload a file to back end and rename it to request param", async () => {
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

describe("Post to create a new station", () => {
  it("create new journey based on a valid json object from request body", async () => {
    const randomId = 1000 + Math.round(Math.random() * 1000);
    const data = {
      "id": randomId,
      "name": "Test station",
      "address": "test address",
      "x": 1,
      "y": 1
    }
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
