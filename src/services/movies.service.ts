import { Database } from "../data/database";
import { MoviesRepository } from "../repositories/movies.repository";

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

  async createMovie(movieData: {
    year: number;
    title: string;
    studios: string;
    producers: string[];
    winner: boolean;
  }) {}

  async updateMovie(
    id: number,
    movieData: {
      year: number;
      title: string;
      studios: string;
      producers: string[];
      winner: boolean;
    },
  ) {}

  async deleteMovie(id: number) {}

  async getIntervals(): Promise<ProducerIntervals> {
    return {
      min: [],
      max: [],
    };
  }
}
