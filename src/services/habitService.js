import * as habitRepository from '../repositories/habitRepository.js';

function isHabitValid(habit) {
    const { name, days } = habit;

    if (!name || !days || days.length === 0) return false;
    if (days.some((day) => day < 0 || day > 6)) return false;
    if (days.some((day) => day % 1 !== 0)) return false;
    return true;
}

async function createNewHabit(habit, userId) {
    const newHabitId = await habitRepository.insertHabit(habit, userId);

    const newHabit = {
        id: newHabitId,
        name: habit.name,
        days: habit.days,
    };

    return newHabit;
}

async function searchHabitsList(userId) {
    const habits = await habitRepository.selectHabits(userId);
    habits.forEach((habit) => {
        // eslint-disable-next-line no-param-reassign
        habit.days = JSON.parse(habit.days);
    });
    return habits;
}

async function searchTodayHabits(userId) {
    const habits = await habitRepository.selectTodayHabits(userId);
    return habits;
}

export {
    isHabitValid,
    createNewHabit,
    searchHabitsList,
    searchTodayHabits,
};
