import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const insertMovieSchema = Joi.object({
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
  const { error } = insertMovieSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      message: error.details[0].message,
    });
    return;
  }

  next();
}

const updateMovieSchema = Joi.object({
  title: Joi.string().optional(),
  year: Joi.number().integer().optional(),
  studios: Joi.string().optional(),
  producers: Joi.array().optional(),
  winner: Joi.boolean().optional(),
});

export function validateUpdateMovie(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { error } = updateMovieSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      message: error.details[0].message,
    });
    return;
  }

  next();
}
