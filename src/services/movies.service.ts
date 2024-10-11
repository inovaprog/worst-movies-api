import { Database } from "../data/database";
import { Producer } from "../entities/producer.entity";
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
    const result = await this.moviesRepository.getInterval();
    const min = result
      .filter((movie) => movie.type === "min")
      .map(this.mapProducerInterval);

    const max = result
      .filter((movie) => movie.type === "max")
      .map(this.mapProducerInterval);
    return {
      min,
      max,
    };
  }

  private mapProducerInterval(item: {
    producer_name: string;
    interval: number;
    previous_win: number;
    following_win: number;
  }): IntervalResult {
    return {
      producer: item.producer_name,
      interval: item.interval,
      previousWin: item.previous_win,
      followingWin: item.following_win,
    };
  }
}
