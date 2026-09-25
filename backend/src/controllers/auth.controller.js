import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken, cookieOptions } from '../utils/token.js';
import { env } from '../config/env.js';

// Only send safe fields back to the frontend — never the password
function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    skills: user.skills,
    role: user.role,
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict('An account with this email already exists');

  const user = await User.create({ name, email, password });
  // Mongoose's pre-save hook (Step 5) hashes the password before this line runs

  const token = signToken(user._id);
  res.cookie(env.COOKIE_NAME, token, cookieOptions());

  sendSuccess(res, 201, toPublicUser(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // .select('+password') because the schema hides it by default (Phase 2)
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

  const token = signToken(user._id);
  res.cookie(env.COOKIE_NAME, token, cookieOptions());

  sendSuccess(res, 200, toPublicUser(user));
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.COOKIE_NAME, cookieOptions());
  sendSuccess(res, 200, { loggedOut: true });
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, toPublicUser(req.user));
});