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
