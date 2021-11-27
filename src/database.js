import pg from 'pg';

const { Pool } = pg;

const connection = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    // eslint-disable-next-line radix
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
});

export default connection;
