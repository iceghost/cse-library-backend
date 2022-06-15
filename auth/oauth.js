const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID =
    '535868303715-5hnlm9eolhmgusl796sm5mujbp7h87qh.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

/**
 * @param {string} token
 */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (!email) throw new Error('cannot decode email from payload');
    return email;
}

module.exports = { verify };
