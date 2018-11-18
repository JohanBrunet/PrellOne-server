const oAuthAccessToken = require('../models/OAuthAccessToken')

module.exports = (req, res, next) => {
    try {
        const header = req.get('Authorization')
        if (!header) throwError(400, 'Authorization header missing')
        const token = header.split(' ')[1]
        const accessToken = oAuthAccessToken.findOne({accessToken: token})
        if (accessToken.accessTokenExpiresOn > new Date()) return next()
        else throw new Error()
    }
    catch (error) {
        throwError(400, 'Invalid access token')
    }
}