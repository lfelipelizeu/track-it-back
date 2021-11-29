import '../../src/setup.js';
import bcrypt from 'bcrypt';
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
