import request from "supertest";
import express from "express";
import { Database } from "../src/data/database";
import { MoviesController } from "../src/controllers/movies.controller";
import path from "path";

const app = express();
const db = new Database();
const moviesController = new MoviesController(db);
const csvFilePath = path.resolve(__dirname, "../tests/test.movielist.csv");

app.use(express.json());
app.get("/movies", (req, res) => moviesController.getAllMovies(req, res));
app.get("/movies/:id", (req, res) => moviesController.getMovieById(req, res));

describe("Movies API", () => {
  beforeAll(async () => {
    await db.connect("./tests.sqlite3");
    await db.dropTables();
    await db.createTables();
    await db.processCSV(csvFilePath);
  });

  it("should return all movies", async () => {
    const response = await request(app).get("/movies");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(4);
  });

  it("should return a specific movie by id", async () => {
    const movieId = 1;
    const response = await request(app).get(`/movies/${movieId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", movieId);

    const notFoundResponse = await request(app).get(`/movies/9999`);
    expect(notFoundResponse.status).toBe(404);
    expect(notFoundResponse.body).toHaveProperty("message", "Not Found");
  });

  it("should return 400 for invalid id", async () => {
    const response = await request(app).get("/movies/invalid_id");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "`id` must be integer");
  });
});
