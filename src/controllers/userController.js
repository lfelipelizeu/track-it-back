import * as userService from '../services/userService.js';

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

export {
    signUp,
};
