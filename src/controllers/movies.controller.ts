import { Request, Response } from "express";
import { MoviesService } from "../services/movies.service";
import { Database } from "../data/database";

export class MoviesController {
  private service: MoviesService;

  constructor(db: Database) {
    this.service = new MoviesService(db);
  }

  async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await this.service.getAllMovies();
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getMovieById(req: Request, res: Response) {
    const { id } = req.params;
    if (isNaN(+id)) {
      res.status(400).json({ message: "`id` must be integer" });
      return;
    }
    try {
      const movie = await this.service.getMovieById(+id);
      if (!movie) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async createMovie(req: Request, res: Response) {
    try {
      const response = await this.service.createMovie(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateMovie(req: Request, res: Response) {
    const { id } = req.params;
    if (isNaN(+id)) {
      res.status(400).json({ message: "`id` must be integer" });
      return;
    }
    try {
      const response = await this.service.updateMovie(+id, req.body);
      if (!response) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteMovie(req: Request, res: Response) {}

  async getProducerWinIntervals(req: Request, res: Response) {}
}
