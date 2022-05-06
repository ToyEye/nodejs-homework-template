const statusMessage = {
  400: "BadRequest",
  401: "Unauthorized",
  404: "Not Found",
  409: "Conflict",
};

const createError = (status, message = statusMessage[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};
module.exports = createError;
