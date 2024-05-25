import rateLimit from 'express-rate-limit';

function rateLimiter(windowMs = 15 * 60 * 1000, max = 1000) {
  return rateLimit({
    windowMs,
    max,
    message: `Too many requests from this IP, please try again after ${
      windowMs / 60 / 15
    } minutes`,
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export default rateLimiter;
