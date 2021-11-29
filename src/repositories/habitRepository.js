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
        if (dayjs().day(day).isSame(dayjs()) || dayjs().day(day).isAfter(dayjs())) {
            query += ` ($${parameters.length + 1}, $${parameters.length + 2}, false),`;
            parameters.push(id);
            parameters.push(dayjs().day(day).format('DD/MM/YYYY'));
        }

        query += ` ($${parameters.length + 1}, $${parameters.length + 2}, false)`;
        parameters.push(id);
        parameters.push(nextWeek.day(day).format('DD/MM/YYYY'));

        query += index + 1 === days.length ? ';' : ',';
    });

    await connection.query(query, parameters);
}

async function selectHabits(userId) {
    const result = await connection.query('SELECT id, name, weekdays as days FROM habits WHERE user_id = $1;', [userId]);
    const habits = result.rows;
    return habits;
}

async function deleteHabitFromDatabase(habitId) {
    await connection.query('DELETE FROM days_habits WHERE habit_id = $1;', [habitId]);
    const result = await connection.query('DELETE FROM habits WHERE id = $1;', [habitId]);
    const deletedRows = result.rowCount;
    return deletedRows;
}

async function selectTodayHabits(userId) {
    const result = await connection.query('SELECT habits.id, habits.name, habits.current_sequence, habits.highest_sequence, days_habits.done FROM days_habits JOIN habits ON habits.id = days_habits.habit_id WHERE habits.user_id = $1 AND days_habits.date = $2;', [userId, new Date()]);
    const habits = result.rows;
    return habits;
}

async function checkHabit(habitId) {
    const result = await connection.query('UPDATE days_habits SET done = true WHERE habit_id = $1 AND date = $2;', [habitId, new Date()]);
    const updatedRows = result.rowCount;
    return updatedRows;
}

export {
    searchSessionByToken,
    insertHabit,
    createHabitsDaysWeek,
    selectHabits,
    deleteHabitFromDatabase,
    selectTodayHabits,
    checkHabit,
};
