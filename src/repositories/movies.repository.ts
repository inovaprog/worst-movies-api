import { Database } from "../data/database";
import { Movie } from "../entities/movies.entity";
import { Producer } from "../entities/producer.entity";

interface MovieResponse extends Movie {
  producers: string[];
}

export class MoviesRepository {
  private db: Database;

  constructor(database: Database) {
    this.db = database;
  }

  async addMovieWithProducers(
    movie: Movie,
    producers: Producer[],
  ): Promise<void> {
    const movieId = await this.db.insertMovie(
      movie.year,
      movie.title,
      movie.studios,
      movie.winner,
    );

    for (const producer of producers) {
      const producerId = await this.db.insertProducer(producer.name);
      await this.db.insertMovieProducerRelation(movieId, producerId);
    }
  }

  async getMoviesWithProducers(): Promise<any[]> {
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
    const movies: MovieResponse[] = await this.db.runAll(query);
    return movies.map((movie) => ({
      ...movie,
      winner: movie.winner === 1,
    }));
  }

  async getMovieById(id: number): Promise<any> {
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

    const movie: MovieResponse = await this.db.runGet(query, [id]);

    if (movie) {
      return {
        ...movie,
        winner: movie.winner === 1,
      };
    }
  }
}
