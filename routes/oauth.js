// Route for Accessing Board Data via Restful API

const router = require('express').Router()
const OAuthClient = require('../models/OAuthClient')
const uuid = require('uuid')
const asyncWrapper = require('../middlewares/asyncWrapper')


// /* GET ALL BOARDS */
// router.get('/', auth, asyncWrapper(async (req, res, next) => {
//     const boards = await BoardController.getAll()
//     res.type('application/json')
//     res.status(200)
//     res.json(boards)
// }))

/*CREATE A NEW OAUTH CLIENT*/
router.post('/register', asyncWrapper(async (req, res, next) => {
    const newClient = {
        clientName: req.body.clientName,
        redirectUris: [req.body.redirectUri],
        id: Buffer(uuid.v4()).toString('base64'),
        clientSecret: Buffer(uuid.v4()).toString('base64'),
        grants: ['authorization_code']
    }

    const oauthClient = await OAuthClient.create(newClient)
    console.log(oauthClient)
    res.type('application/json')
    res.status(200)
    res.json(oauthClient)
}))

module.exports = router;