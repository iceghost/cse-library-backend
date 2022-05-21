// @ts-check

const client = require('.');

async function login(email) {
    const student = await client.student.findUnique({
        where: { email },
    });
    return student;
}

async function signup({ email, id, fname, lname }) {
    const student = await client.student.create({
        data: {
            email,
            id,
            lname,
            fname,
        },
    });
}

module.exports = { login, signup };
