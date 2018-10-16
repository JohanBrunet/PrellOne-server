const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const randomSecretKey = process.env.SECRET_KEY;

const UserController = require('../controllers/userController');


/**
 * Authenticate the user from the browser
 * @param req
 * @param res
 * @param next
 */
module.exports.doAuthentication = async (data) => {

    const userController = new UserController();

    let user = await userController.get('email', data.email);
    if (!user) { 
        noUser(); 
    }

    // if the user is found but the password is wrong
    if (passwordMatch(data.password, user.password)) {
        const token = createToken(user.id);
        return authorize(user, token);
    }
    else  {
        user = false;
        console.error(err);
        throw err;
    };
}

/**
 * check if user is already authenticated
 */
module.exports.isAuthenticated = (req, res, next) => {
    if (req.cookies && req.cookies.closemap && jwt.verify(req.cookies.closemap.appAuthToken, randomSecretKey)) {
        return next();
    }
    unauthorize();
}

noUser = () => {
    let err = new Error();
    err.statusCode = 404;
    err.message = 'User does not exist';
    throw err;
}

unauthorize = () => {
    let err = new Error();
    err.statusCode = 401;
    err.message = 'Unauthorized';
    throw err;
}

authorize = async (user, token) => {
    let result = {}
    result.user = await user.toJson();
    delete result.user.password;
    result.appAuthToken = token
    return result;
}

createToken = (object) => {
    return jwt.sign(object, randomSecretKey);
}

hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, saltRounds);
}

passwordMatch = async (plainPassword, passwordHash) => {
    return await bcrypt.compare(plainPassword, passwordHash);
}