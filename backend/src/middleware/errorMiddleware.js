// `middleware/errorMiddleware.js`

// Critical: Express requires all 4 parameters to recognize this as an error handler!
const errorHandler = (err, req, res, next) => {
  // If status is 200, force it to 500, otherwise keep the active status code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  res.json({
    message: err.message,
    // This line prints the exact file and line number causing the crash in development!
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, 
  });
};

export default errorHandler;
