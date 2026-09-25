import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

// Runs after express-validator's rule checks; turns their errors into our ApiError format
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.badRequest('Validation failed', errors.array()));
  }
  next();
}