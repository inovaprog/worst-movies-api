import express from "express";
import * as path from "path";
import { Database } from "./data/database";
import { MoviesRoutes } from "./routers/movies.router";

const app = express();
app.use(express.json());

const port = 3000;

const csvFilePath = path.resolve(__dirname, "data/movielist.csv");

async function bootstrap() {
  const db = new Database();
  await db.connect("./dev.sqlite3");
  await db.dropTables();
  await db.createTables();
  await db.processCSV(csvFilePath);

  const moviesRoutes = new MoviesRoutes(db);

  app.use("/movies", moviesRoutes.router);
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap();
