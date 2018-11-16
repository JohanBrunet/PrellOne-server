// Route for Accessing Board Data via Restful API

const router = require('express').Router()
const auth = require('../middlewares/authMiddleware').isAuthenticated
const decodeToken = require('../middlewares/authMiddleware').decodeToken
const asyncWrapper = require('../middlewares/asyncWrapper')
const BoardController = require('../controllers/boardController')
const ListController=require('../controllers/listController')
const LabelController=require('../controllers/labelController')


/* GET ALL BOARDS */
router.get('/', auth, asyncWrapper( async(req, res, next) => {
    const boards = await BoardController.getAll()
    res.type('application/json')
    res.status(200)
    res.json(boards)
}))

/* GET SINGLE BOARD BY ID */
router.get('/:id', auth, asyncWrapper( async(req, res, next) => {
    const board = await BoardController.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(board)
}))

/* GET LABEL FROM A BOARD */
router.get('/:id/labels', auth, asyncWrapper( async(req, res, next) => {
    const labels= await LabelController.getAll(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(labels)
}))

/* GET LISTS FROM A BOARD  */
router.get('/:id/lists', auth, asyncWrapper( async(req, res, next) => {
    const lists = await ListController.getAll(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(lists)
}))


router.post('/', auth, asyncWrapper( async(req, res, next) => {
    const newBoard = req.body
    const team=req.body.team
    const token = req.get('Authorization').split(' ')[1]
    const owner = decodeToken(token)
    console.log(owner)
    const board = await BoardController.create(newBoard ,owner,team)
    res.type('application/json')
    res.status(200)
    res.json(board)
}))

router.put('/addMember',/* auth, */ asyncWrapper( async(req, res, next) => {
    const username = req.body.username
    const boardId = req.body.boardId
    const member = await BoardController.addMember(boardId,username/*,owner.id*/)
    res.type('application/json')
    res.status(200)
    res.json(member)
}))

router.put('/addTeam',/* auth, */ asyncWrapper( async(req, res, next) => {
    const name = req.body.name
    const boardId = req.body.boardId
    const team = await BoardController.addTeam(boardId,name)
    res.type('application/json')
    res.status(200)
    res.json(team)
}))

module.exports = router;