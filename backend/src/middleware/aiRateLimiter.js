import rateLimit from 'express-rate-limit';


// Matched to gemini-3-flash-preview's actual free-tier ceiling: 5 requests
// per minute, per Google's published rate limits. Setting our own limit
// at the same number means users see OUR friendly error message instead
// of a raw error from Google.
export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Code Mentor AI is limited to 5 requests per minute. Please wait a moment.' },
  },
});