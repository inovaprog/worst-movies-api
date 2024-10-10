import express from "express";
import * as path from "path";
import { Database } from "./data/database";

const app = express();

const port = 3000;

const csvFilePath = path.resolve(__dirname, "data/movielist.csv");

async function bootstrap() {
  const db = new Database();
  await db.connect("./dev.sqlite3");
  await db.createTables();
  await db.processCSV(csvFilePath);
}

bootstrap();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
