/* eslint-disable no-console */
import * as userService from '../services/userService.js';
import * as userRepository from '../repositories/userRepository.js';

async function signUp(req, res) {
    const validationError = userService.signUpDataValidationError(req.body);
    if (validationError) return res.status(400).send(validationError.message);

    try {
        await userService.createUser(req.body);

        return res.sendStatus(201);
    } catch (error) {
        const { constraint } = error;
        if (constraint === 'users_email_key') return res.sendStatus(409);
        console.error(error);

        return res.sendStatus(500);
    }
}

async function signIn(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    try {
        const user = await userRepository.searchEmail(email);
        if (!user) return res.sendStatus(404);

        if (!userService.isPasswordCorrect(password, user.password)) return res.sendStatus(401);

        const previousSession = await userRepository.searchSession(user.id);

        // eslint-disable-next-line max-len
        const token = previousSession ? previousSession.token : await userService.createSession(user.id);

        return res.status(200).send({
            name: user.name,
            image: user.image,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export {
    signUp,
    signIn,
};
