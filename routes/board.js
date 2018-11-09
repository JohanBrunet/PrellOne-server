// Route for Accessing Board Data via Restful API

const router = require('express').Router()
const auth = require('../middlewares/authMiddleware').isAuthenticated
const decodeToken = require('../middlewares/authMiddleware').decodeToken
const asyncWrapper = require('../middlewares/asyncWrapper')
const BoardController = require('../controllers/boardController')
const ListController=require('../controllers/listController')
const LabelController=require('../controllers/labelController')


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

/* GET LABEL FROM A BOARD */
router.get('/:id/labels', /* auth, */ asyncWrapper( async(req, res, next) => {
    const labels= await LabelController.getAll(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(labels)
}))

/* GET LISTS FROM A BOARD  */
router.get('/:id/lists', /* auth, */ asyncWrapper( async(req, res, next) => {
    const lists = await ListController.getAll(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(lists)
}))


router.post('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const newBoard = req.body
    const teamId=req.body.teamId
    //const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const owner=req.body.owner
    console.log(owner)
    const board = await BoardController.create(newBoard ,owner,teamId)
    res.type('application/json')
    res.status(200)
    res.json(board)
}))

module.exports = router;