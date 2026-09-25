import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

// Centralizes cookie settings so login/register/logout all agree
export function cookieOptions() {
  return {
    httpOnly: true, // JS in the browser cannot read this cookie
    secure: env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // basic CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in milliseconds
  };
}