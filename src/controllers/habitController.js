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

        await habitRepository.createHabitsDaysWeek(newHabit);

        return res.status(201).send(newHabit);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function getHabits(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    try {
        const session = await habitRepository.searchSessionByToken(token);
        if (!session) return res.sendStatus(401);

        const habits = await habitService.searchHabitsList(session.userId);

        return res.status(200).send(habits);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function deleteHabit(req, res) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) return res.sendStatus(400);

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    try {
        const session = await habitRepository.searchSessionByToken(token);
        if (!session) return res.sendStatus(401);

        const deleted = await habitRepository.deleteHabitFromDatabase(id);
        if (deleted === 0) return res.sendStatus(404);

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function getTodayHabits(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    try {
        const session = await habitRepository.searchSessionByToken(token);
        if (!session) return res.sendStatus(401);

        const todayHabits = await habitService.searchTodayHabits(session.userId);

        return res.status(200).send(todayHabits);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    createHabit,
    getHabits,
    deleteHabit,
    getTodayHabits,
};
