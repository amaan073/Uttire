export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // pass the error to the errorHandler
};

export const errorHandler = (err, req, res, next) => {
  // if a status code was already set (e.g. 404), use it, otherwise default to 500
  //express has status code 200 as default , but when error occurs we need to change it if there is no status code set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // stack trace only in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
