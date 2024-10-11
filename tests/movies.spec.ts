import request from "supertest";
import express from "express";
import { Database } from "../src/data/database";
import { MoviesController } from "../src/controllers/movies.controller";
import path from "path";
import {
  validateInsertMovie,
  validateUpdateMovie,
} from "../src/middlewares/movie.dto";

const app = express();
const db = new Database();
const moviesController = new MoviesController(db);
const csvFilePath = path.resolve(__dirname, "../tests/test.movielist.csv");

app.use(express.json());
app.get("/movies", (req, res) => moviesController.getAllMovies(req, res));
app.get("/movies/:id", (req, res) => moviesController.getMovieById(req, res));
app.post("/movies", validateInsertMovie, (req, res) =>
  moviesController.createMovie(req, res),
);
app.put("/movies/:id", validateUpdateMovie, (req, res) => {
  moviesController.updateMovie(req, res);
});

describe("GET movies/", () => {
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

describe("POST /movies", () => {
  it("should insert a new movie and return 200", async () => {
    const newMovie = {
      title: "Suicide Squad",
      year: 2021,
      studios: "Warner Bros",
      producers: ["Charles Roven", "Richard Suckle"],
      winner: true,
    };

    const response = await request(app).post("/movies").send(newMovie);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Suicide Squad");
  });

  it("should return 400 if request body is missing required fields", async () => {
    const incompleteMovie = {
      year: 2010,
      producers: ["Christopher Nolan"],
      winner: true,
    };

    const response = await request(app).post("/movies").send(incompleteMovie);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('"title" is required');
  });

  it("should return 500 if there is a server error", async () => {
    jest.spyOn(db, "runQuery").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const newMovie = {
      title: "Inception",
      year: 2010,
      studios: "Warner Bros",
      producers: ["Christopher Nolan"],
      winner: true,
    };

    const response = await request(app).post("/movies").send(newMovie);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal Server Error");
  });
});

describe("PUT /movies/:id", () => {
  it("should update a movie and return 200", async () => {
    const updatedMovieData = {
      title: "Inception Updated",
      year: 2010,
      studios: "Warner Bros",
      producers: ["Christopher Nolan"],
      winner: true,
    };

    const response = await request(app)
      .put("/movies/1") // Coloque um ID válido aqui
      .send(updatedMovieData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Inception Updated");
  });

  it("should return 404 if movie not found", async () => {
    const updatedMovieData = {
      title: "Nonexistent Movie",
      year: 2022,
      studios: "Unknown",
      producers: ["Nobody"],
      winner: false,
    };

    const response = await request(app)
      .put("/movies/9999") // ID inválido
      .send(updatedMovieData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Not Found");
  });

  it("should return 400 if id is not an integer", async () => {
    const response = await request(app)
      .put("/movies/abc") // ID não numérico
      .send({ title: "Invalid Movie" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "`id` must be integer");
  });
});
