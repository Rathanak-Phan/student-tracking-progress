/**
 * Standard API response format
 */
export const sendResponse = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: statusCode < 400 ? 'success' : 'error',
    message,
    ...(data && { data })
  });
};

export const success = (res, message, data = null) => {
  sendResponse(res, 200, message, data);
};

export const created = (res, message, data = null) => {
  sendResponse(res, 201, message, data);
};
