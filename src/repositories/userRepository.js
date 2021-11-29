import connection from '../database.js';

async function insertUser(body, hashPassword) {
    const { name, email, image } = body;
    await connection.query('INSERT INTO users (name, email, image, password) VALUES ($1, $2, $3, $4);', [name, email, image, hashPassword]);
}

async function searchEmail(email) {
    const result = await connection.query('SELECT * FROM users WHERE email = $1;', [email]);
    const user = result.rows[0];
    return user;
}

async function searchSession(userId) {
    const result = await connection.query('SELECT * FROM sessions WHERE user_id = $1;', [userId]);
    const session = result.rows[0];
    return session;
}

async function insertSession(userId, token) {
    await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [userId, token]);
}

export {
    insertUser,
    searchEmail,
    searchSession,
    insertSession,
};
