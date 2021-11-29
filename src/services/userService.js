import joi from 'joi';
import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';

function signUpDataValidationError(object) {
    const signUpSchema = joi.object({
        name: joi.string().trim().min(1).required(),
        email: joi.string().trim().email().required(),
        image: joi.string().required(),
        password: joi.string().required(),
        repeatPassword: joi.ref('password'),
    }).with('password', 'repeatPassword');

    const { error } = signUpSchema.validate(object);

    return error;
}

async function createUser(body) {
    const hashPassword = bcrypt.hashSync(body.password, 10);
    await userRepository.insertUser(body, hashPassword);
}

export {
    signUpDataValidationError,
    createUser,
};
