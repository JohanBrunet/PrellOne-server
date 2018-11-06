// Route for Accessing Board Data via Restful API

const router = require('express').Router()
const auth = require('../middlewares/authMiddleware').isAuthenticated
const decodeToken = require('../middlewares/authMiddleware').decodeToken
const asyncWrapper = require('../middlewares/asyncWrapper')
const BoardController = require('../controllers/boardController')

/* GET ALL BOARDS */
router.get('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const boards = await BoardController.getAll()
    res.type('application/json')
    res.status(200)
    res.json(boards)
}))

/* GET SINGLE BOARD BY ID */
router.get('/:id', /* auth, */ asyncWrapper( async(req, res, next) => {
    const board = await BoardController.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(board)
}))

router.post('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const newBoard = req.body.newBoard
    const teamId=req.body.teamId
    //const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const board = await BoardController.create(newBoard /*,owner.id*/,teamId)
    res.type('application/json')
    res.status(200)
    res.json(board)
}))

module.exports = router;