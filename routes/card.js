// Route for Accessing Card Data via Restful API

const router = require('express').Router()
const auth = require('../middlewares/authMiddleware').isAuthenticated
const asyncWrapper = require('../middlewares/asyncWrapper')
const cardController = require('../controllers/cardController')

/* GET ALL CARDS */
router.get('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const cards = await cardController.getAll()
    res.type('application/json')
    res.status(200)
    res.json(cards)
}))

/* GET SINGLE CARD BY ID */
router.get('/:id', /* auth, */ asyncWrapper( async(req, res, next) => {
    const card= await cardController.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(card)
}))

router.post('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const newCard = req.body
    const card = await cardController.create(newCard)
    res.type('application/json')
    res.status(200)
    res.json(card)
}))

module.exports = router;