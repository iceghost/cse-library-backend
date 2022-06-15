const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID =
    '535868303715-5hnlm9eolhmgusl796sm5mujbp7h87qh.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

/**
 * @param {string} token
 * @returns {Promise<import('google-auth-library').TokenPayload | undefined>}
 */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

module.exports = { verify };
