import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const movieSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  studios: Joi.string().required(),
  producers: Joi.array().required(),
  winner: Joi.boolean().optional(),
});

export function validateInsertMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { error } = movieSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
}
