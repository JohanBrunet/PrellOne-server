const router = require('express').Router()
const auth = require('../middlewares/authMiddleware').isAuthenticated
const decodeToken = require('../middlewares/authMiddleware').decodeToken
const asyncWrapper = require('../middlewares/asyncWrapper')
const TeamController = require('../controllers/teamController')

/* GET ALL TEAM */
router.get('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const teams = await TeamController.getAll()
    res.type('application/json')
    res.status(200)
    res.json(teams)
}))

/* GET SINGLE TEAM BY ID */
router.get('/:id', /* auth, */ asyncWrapper( async(req, res, next) => {
    const team= await TeamController.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(team)
}))
/*POST A NEW TEAM*/

router.post('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const newTeam=req.body
    const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const team = await TeamController.create(newTeam ,owner.id)
    res.type('application/json')
    res.status(200)
    res.json(team)
}))

/*PUT A TEAM*/

router.put('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const updatedTeam=req.body
    //const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const team = await TeamController.update(updatedTeam /*,owner.id*/)
    res.type('application/json')
    res.status(200)
    res.json(team)
}))

router.put('/addMember',/* auth, */ asyncWrapper( async(req, res, next) => {
    const idUser=req.body.idUser
    const idTeam=req.body.idTeam
    //const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const team = await TeamController.addMember(idUser,idTeam/*,owner.id*/)
    res.type('application/json')
    res.status(200)
    res.json(team)
}))
module.exports = router;