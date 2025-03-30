/**
 * Middleware to add security headers to all responses
 */
const securityMiddleware = (req, res, next) => {
  // Prevent browsers from interpreting files as a different MIME type
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking by preventing the browser from embedding this page in a frame
  res.setHeader('X-Frame-Options', 'DENY');

  // Enable the XSS filter built into modern browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent all or specified parts of a web page from being cached
  if (req.path.includes('/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // Strict-Transport-Security: Enforce HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  next();
};

export default securityMiddleware;
