// Custom logger middleware

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function logger(req, res, next) {
  const now = new Date();
  const method = req.method;
  const url = req.originalUrl;
  const status = res.statusCode;

  // Log request details in a custom format
  console.log(`[${now.toISOString()}] ${method} ${url} - Status: ${status}`);
  next(); // Pass the control to the next middleware/route
}
