import '../../src/setup.js';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../src/app.js';
import createUser from '../factories/userFactory.js';
import connection from '../../src/database.js';

const agent = supertest(app);

describe('POST /signup', () => {
    const user = createUser();

    beforeAll(async () => {
        const hashPassword = bcrypt.hashSync(user.password, 10);
        await connection.query('INSERT INTO users (name, email, image,password) VALUES ($1, $2, $3, $4) RETURNING *;', [user.name, user.email, user.image, hashPassword]);
    });

    afterAll(async () => {
        await connection.query('DELETE FROM users;');
    });

    it('returns 400 for invalid body', async () => {
        const testUser = createUser();

        const body = {
            name: testUser.name,
            password: testUser.password,
            image: testUser.image,
            repeatPassword: testUser.password,
        };

        const result = await agent.post('/signup').send(body);
        expect(result.status).toEqual(400);
    });

    it('returns 409 for email already registered', async () => {
        const body = user;

        const result = await agent.post('/signup').send(body);
        expect(result.status).toEqual(409);
    });

    it('returns 201 for valid data', async () => {
        const body = createUser();

        const result = await agent.post('/signup').send(body);
        expect(result.status).toEqual(201);
    });
});
