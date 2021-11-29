import connection from '../database.js';

async function insertUser(body, hashPassword) {
    const { name, email, image } = body;
    await connection.query('INSERT INTO users (name, email, image, password) VALUES ($1, $2, $3, $4);', [name, email, image, hashPassword]);
}

export {
    insertUser,
};
