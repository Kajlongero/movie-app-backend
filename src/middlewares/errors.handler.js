const BoomErrorHandler = (err, req, res, next) => {
  if (err.isBoom) {
    const { output } = err;

    res.status(output.statusCode).json(output.payload);
  }
};

const InternalServerError = (err, req, res, next) => {
  res.status(500).json({
    error: "Internal Server Error",
    message: "Internal Server Error",
    statusCode: 500,
  });
};

module.exports = {
  BoomErrorHandler,
  InternalServerError,
};
