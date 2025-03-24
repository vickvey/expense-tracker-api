class ApiResponse {
  /**
   * Send a successful response
   * @param {Response} res - Express response object
   * @param {number} statusCode - HTTP status code (e.g., 200, 201)
   * @param {string} message - Success message
   * @param {any} data - Response data (object, array, etc.)
   */
  static send(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Send an error response
   * @param {Response} res - Express response object
   * @param {number} statusCode - HTTP error code (e.g., 400, 404, 500)
   * @param {string} errorMessage - Error message
   */
  static error(res, statusCode, errorMessage) {
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      data: null,
    });
  }
}

export default ApiResponse;
