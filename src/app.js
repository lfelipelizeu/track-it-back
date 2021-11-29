import express from 'express';
import cors from 'cors';
import * as userController from './controllers/userController.js';
import * as habitController from './controllers/habitController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', userController.signUp);

app.post('/signin', userController.signIn);

app.post('/habits', habitController.createHabit);

export default app;
