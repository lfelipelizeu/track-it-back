import '../../src/setup.js';
import bcrypt from 'bcrypt';
import faker from 'faker';
import createUser from '../factories/userFactory.js';
import connection from '../../src/database.js';
import * as userService from '../../src/services/userService.js';

describe('POST /signup', () => {
    const user = createUser();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        await connection.query('INSERT INTO users (name, email, image,password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.email, user.image, hashPassword]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('should return an error message for missing email', () => {
        const testUser = createUser();

        const body = {
            name: testUser.name,
            password: testUser.password,
            image: testUser.image,
            repeatPassword: testUser.password,
        };

        const validationError = userService.signUpDataValidationError(body);
        expect(validationError).not.toBeUndefined();
    });

    it('should not return an error message for valid body', () => {
        const body = createUser();

        const validationError = userService.signUpDataValidationError(body);
        expect(validationError).toBeUndefined();
    });
});

describe('POST /signin', () => {
    const user = createUser();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const result = await connection.query('INSERT INTO users (name, email, image,password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.email, user.image, hashPassword]);
        user.id = result.rows[0].id;
    });

    afterAll(async () => {
        await connection.query('DELETE FROM sessions;');
        await connection.query('DELETE FROM users;');
    });

    it('should returns false for sync compare failure', () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        const otherPassword = faker.internet.password();

        const passwordSyncCompare = userService.isPasswordCorrect(otherPassword, hashPassword);
        expect(passwordSyncCompare).toEqual(false);
    });

    it('should returns true for sync compare successful', () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);

        const passwordSyncCompare = userService.isPasswordCorrect(user.password, hashPassword);
        expect(passwordSyncCompare).toEqual(true);
    });

    it('should return a uuid type token', async () => {
        const token = await userService.createSession(user.id);

        expect(token).toEqual(expect.stringMatching(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i));
    });
});
