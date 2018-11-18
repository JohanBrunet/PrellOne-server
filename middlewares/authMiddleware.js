const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const randomSecretKey = process.env.SECRET_KEY;

const userController = require('../controllers/userController');
const ldap = require('../controllers/ldapController')
const throwError = require('../utils/throwError')

/* AUTHENTICATE THE USER FROM THE BROWSER*/
module.exports.doAuthentication = async (credential, password, withLdap = false) => {
    if (withLdap) {
        try {
            await ldap.auth(credential, password)
            let user = await userController.getByUsername(credential)
            if (!user || user.length == 0) {
                let [fn, ln] = credential.split('.')
                fn = fn.charAt(0).toUpperCase() + fn.substr(1)
                ln = ln.charAt(0).toUpperCase() + ln.substr(1)
                const newuser = {
                    firstname: fn,
                    lastname: ln,
                    username: credential,
                    email: `${credential}@etu.umontpellier.fr`,
                    loginType: 'ldap',
                    profilePicture: 'https://prellone.s3.amazonaws.com/johan/lapin-c2b35fd3-1d16-4572-88ca-cfcbad6d17c2.jpeg'
                }
                user = await userController.create(newuser)
            }
            const token = encodeToken(user.id)
            return authorize(user, token)
        }
        catch (error) {
            console.log('error')
            console.error(error)
            throwError(401, 'Invalid credentials')
        }
    }
    else {
        let user = await userController.getUserLogin(credential)
        if (!user || user.length == 0) {
            throwError(401, 'Invalid credentials')
        }

        // if the user is found but the password is wrong
        if (await this.passwordMatch(password, user.password)) {
            const token = encodeToken(user.id);
            return authorize(user, token);
        }
        else {
            user = false;
            throwError(401, 'Invalid credentials')
        }
    }
}

/*CHECK IF THE USER IS ALREADY AUTHENTICATED*/
module.exports.isAuthenticated = (req, res, next) => {
    try {
        const header = req.get('Authorization')
        if (!header) throwError(400, 'Authorization header missing')
        const token = header.split(' ')[1]
        const decodedToken = this.decodeToken(token)
        return next()
    }
    catch (error) {
        throw error
    }
}

authorize = async (user, token) => {
    let userWithBoards = await userController.getWithBoards(user.username)
    return { user: userWithBoards, token: token }
}

encodeToken = (userId) => {
    return jwt.sign({ 'id': userId }, randomSecretKey);
}

module.exports.decodeToken = (token) => {
    try {
        const userId = jwt.verify(token, randomSecretKey).id
        return userId
    }
    catch (error) {
        throwError(400, "Invalid token")
    }
}

module.exports.hashPassword = async (plainPassword) => {
    return await bcrypt.hash(plainPassword, saltRounds)
}

module.exports.passwordMatch = async (plainPassword, passwordHash) => {
    return await bcrypt.compare(plainPassword, passwordHash);;
}