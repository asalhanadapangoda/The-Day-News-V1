/**
 * Global error handler middleware
 * Handles all errors and returns appropriate status codes
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    statusCode = 401;
  } else if (err.name === 'CastError' || err.message?.includes('Cast to ObjectId')) {
    statusCode = 400; // Invalid ObjectId format
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409; // Duplicate key error
  } else if (err.name === 'MulterError') {
    statusCode = 400; // File upload error
  }
  
  // Standardized error response format
  const errorResponse = {
    message: err.message || 'An error occurred',
    error: err.name || 'Error',
  };
  
  // Only include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode);
  res.json(errorResponse);
};

