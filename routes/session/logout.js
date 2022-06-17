/**
 *
 * @type {import("express").Handler}
 */
const logoutHandler = async (req, res) => {
    res.clearCookie('email');
    res.status(200).send();
};

module.exports = logoutHandler;
