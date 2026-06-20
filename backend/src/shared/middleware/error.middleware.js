/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Sequelize Validation Errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle common auth errors
  if (message.includes('not found') || message.includes('Invalid password') || message.includes('Invalid token')) {
    statusCode = 401;
  }
  
  if (message.includes('pending admin validation') || message.includes('Account is inactive') || message.includes('Account has been deleted') || message.includes('Unauthorized')) {
    statusCode = 403;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
