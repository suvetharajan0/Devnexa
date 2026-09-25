import { verifyToken } from '../utils/token.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

// Attaches req.user if the cookie is present and valid. Blocks the request otherwise.
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) throw ApiError.unauthorized('You must be logged in');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw ApiError.unauthorized('Session expired or invalid — please log in again');
  }

  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized('User no longer exists');

  req.user = user; // now every controller after this knows who's asking
  next();
});

// Restricts a route to specific roles, e.g. authorize('admin')
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to do this'));
    }
    next();
  };
}