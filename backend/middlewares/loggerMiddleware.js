// ─── Request Logger Middleware ─────────────────────────────────────────────────
// Logs every incoming HTTP request with method, URL, IP, and timestamp
// Active in ALL environments (can be filtered by NODE_ENV if needed)

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  // Log when the response finishes so we can include response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status   = res.statusCode;
    const method   = req.method.padEnd(6);
    const url      = req.originalUrl;
    const ip       = req.ip || req.socket?.remoteAddress || 'unknown';

    // Color-code status in development
    let statusLog = `[${status}]`;
    if (process.env.NODE_ENV === 'development') {
      if (status >= 500) statusLog = `\x1b[31m[${status}]\x1b[0m`;      // red
      else if (status >= 400) statusLog = `\x1b[33m[${status}]\x1b[0m`; // yellow
      else if (status >= 200) statusLog = `\x1b[32m[${status}]\x1b[0m`; // green
    }

    console.log(
      `📥 ${new Date().toISOString()} | ${method} ${url} | ${statusLog} | ${duration}ms | IP: ${ip}`
    );
  });

  next();
};

module.exports = loggerMiddleware;
