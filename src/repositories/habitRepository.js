import connection from '../database.js';

async function searchSessionByToken(token) {
    const result = await connection.query('SELECT *, user_id as "userId" FROM sessions WHERE token = $1;', [token]);
    const session = result.rows[0];
    return session;
}

async function insertHabit(habit, userId) {
    const { name, days } = habit;
    const jsonDays = JSON.stringify(days);
    await connection.query('INSERT INTO habits (user_id, name, weekdays, current_sequence, highest_sequence) VALUES ($1, $2, $3, 0, 0);', [userId, name, jsonDays]);
}

export {
    searchSessionByToken,
    insertHabit,
};
