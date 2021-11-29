function isHabitValid(habit) {
    const { name, days } = habit;

    if (!name || !days || days.length === 0) return false;
    if (days.some((day) => day < 0 || day > 6)) return false;
    if (days.some((day) => day % 1 !== 0)) return false;
    return true;
}

export {
    isHabitValid,
};
