import * as habitRepository from '../repositories/habitRepository.js';

async function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    const session = await habitRepository.searchSessionByToken(token);
    if (!session) return res.sendStatus(401);

    req.session = session;
    return next();
}

export default auth;
