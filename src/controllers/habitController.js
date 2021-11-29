/* eslint-disable no-console */
import * as habitRepository from '../repositories/habitRepository.js';
import * as habitService from '../services/habitService.js';

async function createHabit(req, res) {
    try {
        if (!habitService.isHabitValid(req.body)) return res.sendStatus(400);

        const { userId } = req.session;
        const newHabit = await habitService.createNewHabit(req.body, userId);

        await habitRepository.createHabitsDaysWeek(newHabit);

        return res.status(201).send(newHabit);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function getHabits(req, res) {
    try {
        const { userId } = req.session;
        const habits = await habitService.searchHabitsList(userId);

        return res.status(200).send(habits);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function deleteHabit(req, res) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) return res.sendStatus(400);

    try {
        const deleted = await habitRepository.deleteHabitFromDatabase(id);
        if (deleted === 0) return res.sendStatus(404);

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function getTodayHabits(req, res) {
    try {
        const { userId } = req.session;
        const todayHabits = await habitService.searchTodayHabits(userId);

        return res.status(200).send(todayHabits);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function checkTodayHabit(req, res) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) return res.sendStatus(400);

    try {
        const updated = await habitRepository.checkHabit(id);
        if (updated === 0) return res.sendStatus(404);

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function uncheckTodayHabit(req, res) {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) return res.sendStatus(400);

    try {
        const updated = await habitRepository.uncheckHabit(id);
        if (updated === 0) return res.sendStatus(404);

        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

async function getHistory(req, res) {
    try {
        const { userId } = req.session;
        const habitsHistory = await habitService.getHabitsHistory(userId);

        return res.status(200).send(habitsHistory);
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
    checkTodayHabit,
    uncheckTodayHabit,
    getHistory,
};
