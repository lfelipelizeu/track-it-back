import express from 'express';
import cors from 'cors';
import * as userController from './controllers/userController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/signup', userController.signUp);

app.post('/signin', userController.signIn);

export default app;
