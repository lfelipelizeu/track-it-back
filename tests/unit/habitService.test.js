/* eslint-disable no-undef */
import '../../src/setup.js';
import faker from 'faker';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import createHabit from '../factories/habitFactory.js';
import connection from '../../src/database.js';
import createUser from '../factories/userFactory.js';
import * as habitService from '../../src/services/habitService.js';

describe('POST /habits', () => {
    const user = createUser();
    const token = faker.datatype.uuid();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const result = await connection.query('INSERT INTO users (name, email, image,password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.email, user.image, hashPassword]);
        user.id = result.rows[0].id;
        await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [user.id, token]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM habits;');
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('should returns false for empty days array', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns false for a negative day', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [-1, 0],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns false for a day bigger than 6', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [0, 7],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns false for a decimal day', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [0, 1.2],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns true valid habit', () => {
        const habit = createHabit();

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(true);
    });

    it('should returns the same object', async () => {
        const habit = createHabit();

        const result = await habitService.createNewHabit(habit, user.id);
        delete result.id;
        expect(result).toEqual(habit);
    });
});

describe('GET /habits', () => {
    const user = createUser();
    const token = faker.datatype.uuid();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const result = await connection.query('INSERT INTO users (name, email, image,password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.email, user.image, hashPassword]);
        user.id = result.rows[0].id;
        await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [user.id, token]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM habits;');
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('should returns an array with the object', async () => {
        const habit = createHabit();

        const newHabit = await habitService.createNewHabit(habit, user.id);
        const result = await habitService.searchHabitsList(user.id);

        expect(result.find((resultHabit) => resultHabit.id === newHabit.id)).toBeTruthy();
    });
});

describe('GET /today', () => {
    const user = createUser();
    const token = faker.datatype.uuid();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const result = await connection.query('INSERT INTO users (name, email, image,password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.email, user.image, hashPassword]);
        user.id = result.rows[0].id;
        await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [user.id, token]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM days_habits;');
        await connection.query('DELETE FROM habits;');
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('should return the created habit in the array', async () => {
        const habit = createHabit();

        const newHabit = await habitService.createNewHabit(habit, user.id);
        const result = await habitService.searchHabitsList(user.id);

        expect(result.find((resultHabit) => resultHabit.id === newHabit.id)).toBeTruthy();
    });
});

describe('GET /today', () => {
    const user = createUser();
    const token = faker.datatype.uuid();
    const habit1 = createHabit();
    const habit2 = createHabit();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const result = await connection.query('INSERT INTO users (name, email, image,password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.email, user.image, hashPassword]);
        user.id = result.rows[0].id;
        await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2);', [user.id, token]);
        const result2 = await connection.query('INSERT INTO habits (user_id, name, weekdays, current_sequence, highest_sequence) VALUES ($1, $2, $3, 0, 0), ($4, $5, $6, 0, 0) RETURNING *;', [user.id, habit1.name, JSON.stringify(habit1.days), user.id, habit2.name, JSON.stringify(habit2.days)]);
        await connection.query('INSERT INTO days_habits (habit_id, date, done) VALUES ($1, $2, false), ($3, $4, false), ($5, $6, true);', [result2.rows[0].id, dayjs().subtract(1, 'week'), result2.rows[0].id, dayjs().subtract(1, 'week'), result2.rows[0].id, dayjs().subtract(3, 'day')]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM days_habits;');
        await connection.query('DELETE FROM habits;');
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('should return the array', async () => {
        const habitsHistory = await habitService.getHabitsHistory(user.id);
        expect(habitsHistory[0].habits.length).toBeGreaterThanOrEqual(1);
    });
});
