const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const randomSecretKey = process.env.SECRET_KEY;

const userController = require('../controllers/userController');


/**
 * Authenticate the user from the browser
 * @param req
 * @param res
 * @param next
 */
module.exports.doAuthentication = async (data) => {

    let user = await userController.getByEmail(data.email);
    if (!user || user.length == 0) { 
        noUser(); 
    }

    // if the user is found but the password is wrong
    if (await passwordMatch(data.password, user.password)) {
        const token = createToken(user.id);
        return authorize(user, token);
    }
    else  {
        user = false;
        unauthorize()
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
    delete user.password;
    user.appAuthToken = token;
    return user;
}

createToken = (userId) => {
    return jwt.sign({'id': userId}, randomSecretKey);
}

module.exports.hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, saltRounds).then( hash => hash);
}

passwordMatch = async (plainPassword, passwordHash) => {
    return await bcrypt.compare(plainPassword, passwordHash);;
}