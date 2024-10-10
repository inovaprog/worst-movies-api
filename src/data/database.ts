import sqlite3 from "sqlite3";
import { open, Database as SQLiteDatabase } from "sqlite";
import * as fs from "fs";
import csv from "csv-parser";

export class Database {
  private db: SQLiteDatabase | null = null;

  async runQuery(query: string, params: any[] = []) {
    if (!this.db) throw new Error("Database not connected");
    return await this.db.run(query, params);
  }

  async runGet(query: string, params: any[] = []) {
    if (!this.db) throw new Error("Database not connected");
    return await this.db.get(query, params);
  }

  async runAll(query: string, params: any[] = []) {
    if (!this.db) throw new Error("Database not connected");
    return await this.db.all(query, params);
  }

  async connect(filename: string) {
    this.db = await open({
      filename,
      driver: sqlite3.Database,
    });
  }

  async createTables() {
    await this.createMoviesTable();
    await this.createProducersTable();
    await this.createRelationTable();
  }

  async dropTables() {
    await this.runQuery("DROP TABLE IF EXISTS movie_producers;");
    await this.runQuery("DROP TABLE IF EXISTS movies;");
    await this.runQuery("DROP TABLE IF EXISTS producers;");
  }

  async processCSV(csvFilePath: string) {
    fs.createReadStream(csvFilePath)
      .pipe(csv({ separator: ";" }))
      .on("data", async (row: any) => {
        const year = parseInt(row.year);
        const title = row.title;
        const studios = row.studios;
        const winner = row.winner === "yes";

        const movieId = await this.insertMovie(year, title, studios, winner);

        const producers: string[] = row.producers
          ? row.producers.split(/,| and /).map((p: string) => p.trim())
          : [];

        for (const producer of producers) {
          if (producer != "") {
            const producerId = await this.insertProducer(producer);
            await this.insertMovieProducerRelation(movieId, producerId);
          }
        }
      })
      .on("end", () => {
        console.log("CSV processado com sucesso.");
      })
      .on("error", (err: any) => {
        console.error("Erro ao processar o CSV:", err);
      });
  }

  private async createMoviesTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          year INTEGER,
          title TEXT,
          studios TEXT,
          winner BOOLEAN DEFAULT false
      );`;
    await this.runQuery(query);
  }

  private async createProducersTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS producers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE
    );`;
    await this.runQuery(query);
  }

  private async createRelationTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS movie_producers (
          movie_id INTEGER,
          producer_id INTEGER,
          FOREIGN KEY (movie_id) REFERENCES movies(id),
          FOREIGN KEY (producer_id) REFERENCES producers(id)
    );`;
    await this.runQuery(query);
  }

  async insertMovie(
    year: number,
    title: string,
    studios: string,
    winner: boolean,
  ): Promise<number> {
    const query = `INSERT INTO movies (year, title, studios, winner) VALUES (?, ?, ?, ?)`;
    let result = await this.runQuery(query, [year, title, studios, winner]);

    if (result.lastID) {
      return result.lastID;
    }

    throw new Error("Filme nao encontrado após inserção");
  }

  async insertProducer(name: string): Promise<number> {
    const insertQuery = `INSERT OR IGNORE INTO producers (name) VALUES (?)`;
    await this.runQuery(insertQuery, [name]);

    const selectQuery = `SELECT id FROM producers WHERE name = ?`;
    const row = await this.runGet(selectQuery, [name]);

    if (row) {
      return row.id;
    }

    throw new Error(`Produtor não encontrado após inserção`);
  }

  async insertMovieProducerRelation(movieId: number, producerId: number) {
    const query = `INSERT INTO movie_producers (movie_id, producer_id) VALUES (?, ?)`;
    return this.runQuery(query, [movieId, producerId]);
  }
}
