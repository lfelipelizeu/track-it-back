import dayjs from 'dayjs';
import connection from '../database.js';

async function searchSessionByToken(token) {
    const result = await connection.query('SELECT *, user_id as "userId" FROM sessions WHERE token = $1;', [token]);
    const session = result.rows[0];
    return session;
}

async function insertHabit(habit, userId) {
    const { name, days } = habit;
    const jsonDays = JSON.stringify(days);

    const result = await connection.query('INSERT INTO habits (user_id, name, weekdays, current_sequence, highest_sequence) VALUES ($1, $2, $3, 0, 0) RETURNING *;', [userId, name, jsonDays]);
    const habitId = result.rows[0].id;

    return habitId;
}

async function createHabitsDaysWeek(habit) {
    const { id, days } = habit;
    const nextWeek = dayjs().add('1', 'week');

    let query = 'INSERT INTO days_habits (habit_id, date, done) VALUES';
    const parameters = [];

    days.forEach((day, index) => {
        query += ` ($${parameters.length + 1}, $${parameters.length + 2}, false)`;
        parameters.push(id);
        parameters.push(nextWeek.day(day).format('DD/MM/YYYY'));

        query += index + 1 === days.length ? ';' : ',';
    });

    await connection.query(query, parameters);
}

export {
    searchSessionByToken,
    insertHabit,
    createHabitsDaysWeek,
};
