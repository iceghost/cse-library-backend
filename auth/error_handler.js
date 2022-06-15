/**
 *
 * @param {HttpError} error
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
function errorHandler(error, request, response, next) {
    console.error(error);
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status).send(message);
}

module.exports = errorHandler;
