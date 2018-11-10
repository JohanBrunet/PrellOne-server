const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const randomSecretKey = process.env.SECRET_KEY;

const userController = require('../controllers/userController');
const throwError = require('../utils/throwError')

/**
 * Authenticate the user from the browser
 * @param req
 * @param res
 * @param next
 */
module.exports.doAuthentication = async(email, password) => {

    let user = await userController.getByEmailWithPassword(email);
    if (!user || user.length == 0) {
        throwError(404, 'Wrong email or password')
    }

    // if the user is found but the password is wrong
    if (await this.passwordMatch(password, user.password)) {
        const token = encodeToken(user.id);
        return authorize(user, token);
    }
    else  {
        user = false;
        throwError(401, 'Wrong email or password')
    };

}

/**
 * check if user is already authenticated
 */
module.exports.isAuthenticated = (req, res, next) => {
    try {
        const header = req.get('Authorization')
        if (!header) throwError(400, 'Authorization header missing')
        const token = header.split(' ')[1]
        const decodedToken = this.decodeToken(token)
        return next()
    }
    catch(error) {
        throw error
    }
}

authorize = (user, token) => {
    let result = user.toJSON()
    delete result.password
    return {user: result, token: token};
}

encodeToken = (userId) => {
    return jwt.sign({'id': userId}, randomSecretKey);
}

module.exports.decodeToken = (token) => {
    try {
        const userId = jwt.verify(token, randomSecretKey).id
        return userId
    }
    catch(error) {
        throwError(400, "Invalid token")
    }
}

module.exports.hashPassword = async(plainPassword) => {
    return await bcrypt.hash(plainPassword, saltRounds)
}

module.exports.passwordMatch = async(plainPassword, passwordHash) => {
    return await bcrypt.compare(plainPassword, passwordHash);;
}