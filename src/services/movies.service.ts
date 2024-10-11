import { Database } from "../data/database";
import { Movie, MoviesRepository } from "../repositories/movies.repository";

export interface IntervalResult {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

interface ProducerIntervals {
  min: IntervalResult[];
  max: IntervalResult[];
}

export class MoviesService {
  private moviesRepository: MoviesRepository;

  constructor(db: Database) {
    this.moviesRepository = new MoviesRepository(db);
  }

  async getAllMovies() {
    return this.moviesRepository.getMoviesWithProducers();
  }

  async getMovieById(id: number) {
    return this.moviesRepository.getMovieById(id);
  }

  async createMovie(movieData: Movie) {
    return this.moviesRepository.addMovieWithProducers(movieData);
  }

  async updateMovie(id: number, movieData: Partial<Movie>) {
    return this.moviesRepository.updateMovie(id, movieData);
  }

  async deleteMovie(id: number) {
    return this.moviesRepository.deleteMovie(id);
  }

  async getIntervals(): Promise<ProducerIntervals> {
    return {
      min: [],
      max: [],
    };
  }
}
