import * as habitRepository from '../repositories/habitRepository.js';
import * as habitService from '../services/habitService.js';

async function createHabit(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    try {
        const session = await habitRepository.searchSessionByToken(token);
        if (!session) return res.sendStatus(401);

        if (!habitService.isHabitValid(req.body)) return res.sendStatus(400);

        const newHabit = await habitService.createNewHabit(req.body, session.userId);

        return res.status(201).send(newHabit);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    createHabit,
};
