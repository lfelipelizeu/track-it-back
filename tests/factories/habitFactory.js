import faker from 'faker';

function createHabit() {
    const habit = {
        name: faker.lorem.words(3),
        // eslint-disable-next-line max-len
        days: faker.random.arrayElements([0, 1, 2, 3, 4, 5, 6], faker.datatype.number({ min: 1, max: 7 })),
    };

    return habit;
}

export default createHabit;
