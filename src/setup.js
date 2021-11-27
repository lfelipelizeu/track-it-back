import dotenv from 'dotenv';

let envFile = '.env';
if (process.env.NODE_ENV === 'test') envFile = '.env.test';
if (process.env.NODE_ENV === 'dev') envFile = '.env.dev';

dotenv.config({
    path: envFile,
});
