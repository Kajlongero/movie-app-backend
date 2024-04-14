const WithoutBody = (req, res, message, statusCode = 200) => {
  res.status(statusCode).json(message);
};

const WithoutMessage = (req, res, data, statusCode = 200) => {
  res.status(statusCode).json(data);
};

const WithBoth = (req, res, message, data, statusCode = 200) => {
  res.status(statusCode).json({
    message,
    data,
  });
};

module.exports = {
  SuccessResponse: WithBoth,
  SuccessMessage: WithoutBody,
  SuccessBody: WithoutMessage,
};
