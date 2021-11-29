import '../../src/setup.js';
import faker from 'faker';
import bcrypt from 'bcrypt';
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
