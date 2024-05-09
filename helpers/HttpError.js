const defaultMessages = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflist",
};

const HttpErrors = (status, message = defaultMessages[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default HttpErrors;
