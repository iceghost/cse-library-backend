// @ts-check

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function csrf(req, res, next) {
    const csrfCookie = req.cookies['g_csrf_token'];
    if (!csrfCookie) {
        res.status(400);
        res.send('no csrf token found in cookie');
        return;
    }

    const csrfBody = req.body['g_csrf_token'];
    if (!csrfBody) {
        res.status(400);
        res.send('no csrf token found in body');
        return;
    }

    if (csrfCookie != csrfBody) {
        res.status(403);
        res.send('failed csrf token double submit');
        return;
    }
    next();
}

module.exports = csrf;
