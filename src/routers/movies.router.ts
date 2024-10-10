import { Request, Response, Router } from "express";
import { MoviesController } from "../controllers/movies.controller";
import { Database } from "../data/database";

export class MoviesRoutes {
  public router: Router;
  private controller: MoviesController;

  constructor(db: Database) {
    this.router = Router();
    this.controller = new MoviesController(db);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", (req: Request, res: Response) => {
      this.controller.getAllMovies(req, res);
    });

    this.router.get("/:id", (req: Request, res: Response) => {
      this.controller.getMovieById(req, res);
    });

    this.router.post("/", (req: Request, res: Response) => {
      this.controller.createMovie(req, res);
    });

    this.router.put("/:id", (req: Request, res: Response) => {
      this.controller.updateMovie(req, res);
    });

    this.router.delete("/:id", (req: Request, res: Response) => {
      this.controller.deleteMovie(req, res);
    });

    this.router.get("/winners/intervals", (req: Request, res: Response) => {
      this.controller.getProducerWinIntervals(req, res);
    });
  }
}
