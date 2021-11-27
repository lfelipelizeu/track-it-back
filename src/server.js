import './setup.js';
import app from './app.js';

const port = 4000;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${port} e ${process.env.DB_DATABASE}`,);
});
