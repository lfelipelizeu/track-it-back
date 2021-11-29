import '../../src/setup.js';
import faker from 'faker';
import createHabit from '../factories/habitFactory.js';
import connection from '../../src/database.js';
import * as habitService from '../../src/services/habitService.js';

describe('POST /habits', () => {
    it('should returns false for empty days array', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns false for a negative day', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [-1, 0],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns false for a day bigger than 6', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [0, 7],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns false for a decimal day', () => {
        const habit = {
            name: faker.lorem.words(3),
            days: [0, 1.2],
        };

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(false);
    });

    it('should returns true valid habit', () => {
        const habit = createHabit();

        const result = habitService.isHabitValid(habit);
        expect(result).toEqual(true);
    });
});
