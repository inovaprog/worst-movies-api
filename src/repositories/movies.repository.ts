import { Database } from "../data/database";
import { MovieDB } from "../entities/movies.entity";

export interface Movie extends Omit<MovieDB, "winner"> {
  winner: boolean;
  producers: string[];
}

export class MoviesRepository {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async getInterval() {
    const query = `
      WITH winner_producers AS (
          SELECT p.name AS producer_name, m.year
          FROM producers p
          JOIN movie_producers mp ON p.id = mp.producer_id
          JOIN movies m ON m.id = mp.movie_id
          WHERE m.winner = TRUE 
      ),
      producer_intervals AS (
          SELECT wp.producer_name,
                wp.year AS current_year,
                LEAD(wp.year) OVER (PARTITION BY wp.producer_name ORDER BY wp.year) AS next_award_year
          FROM winner_producers wp
      ),
      min_intervals AS (
          SELECT producer_name,
                next_award_year - current_year AS interval,
                current_year AS previous_win,
                next_award_year AS following_win
          FROM producer_intervals
          WHERE next_award_year IS NOT NULL
          AND (next_award_year - current_year) = (
              SELECT MIN(next_award_year - current_year)
              FROM producer_intervals
              WHERE next_award_year IS NOT NULL
          )
      ),
      max_intervals AS (
          SELECT producer_name,
                next_award_year - current_year AS interval,
                current_year AS previous_win,
                next_award_year AS following_win
          FROM producer_intervals
          WHERE next_award_year IS NOT NULL
          AND (next_award_year - current_year) = (
              SELECT MAX(next_award_year - current_year)
              FROM producer_intervals
              WHERE next_award_year IS NOT NULL
          )
      )
      SELECT producer_name, interval, previous_win, following_win, 'min' AS type FROM min_intervals
      UNION ALL
      SELECT producer_name, interval, previous_win, following_win, 'max' AS type FROM max_intervals;
    `;
    return await this.db.runAll(query);
  }

  async deleteMovie(id: number) {
    await this.db.removeRelations(id);
    const query = `DELETE from movies where id = ${id}`;
    return await this.db.runQuery(query);
  }

  async updateMovie(
    id: number,
    updatedData: Partial<Movie>,
  ): Promise<Movie | undefined> {
    if (updatedData.producers) {
      this.db.removeRelations(id);
      for (const producer of updatedData.producers) {
        const producerId = await this.db.insertProducer(producer);
        await this.db.insertMovieProducerRelation(id, producerId);
      }
    }

    delete updatedData.producers;

    const fieldsToUpdate = Object.entries(updatedData)
      .filter(([key, value]) => value !== undefined)
      .map(([key]) => `${key} = ?`);

    const values = Object.values(updatedData).filter(
      (value) => value !== undefined,
    );
    values.push(id);

    if (fieldsToUpdate.length == 0) {
      return await this.getMovieById(id);
    }

    const query = `UPDATE movies SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    const result = await this.db.runQuery(query, values);

    if (result.changes !== 0) {
      return await this.getMovieById(id);
    }
  }

  async addMovieWithProducers(movie: Movie): Promise<Movie> {
    const movieId = await this.db.insertMovie(
      movie.year,
      movie.title,
      movie.studios,
      movie.winner ? 1 : 0,
    );
    movie.id = movieId;

    for (const producer of movie.producers) {
      const producerId = await this.db.insertProducer(producer);
      await this.db.insertMovieProducerRelation(movieId, producerId);
    }

    return movie;
  }

  async getMoviesWithProducers(): Promise<Movie[]> {
    const query = `
            SELECT 
                m.id,
                m.title,
                m.year,
                m.studios,
                m.winner,
                GROUP_CONCAT(p.name, ', ') AS producers
            FROM 
                movies m
            LEFT JOIN 
                movie_producers mp ON m.id = mp.movie_id
            LEFT JOIN 
                producers p ON mp.producer_id = p.id
            GROUP BY 
            m.id;
        `;
    const movies = await this.db.runAll(query);
    return movies.map((movie) => ({
      ...movie,
      winner: movie.winner === 1,
    }));
  }

  async getMovieById(id: number): Promise<Movie | undefined> {
    const query = `
    SELECT 
        m.id,
        m.title,
        m.year,
        m.studios,
        m.winner,
        GROUP_CONCAT(p.name, ', ') AS producers
    FROM 
        movies m
    LEFT JOIN 
        movie_producers mp ON m.id = mp.movie_id
    LEFT JOIN 
        producers p ON mp.producer_id = p.id
    WHERE 
        m.id = ?
    GROUP BY 
        m.id;
  `;

    const movie = await this.db.runGet(query, [id]);

    if (movie) {
      return {
        ...movie,
        winner: movie.winner === 1,
      };
    }
  }
}
