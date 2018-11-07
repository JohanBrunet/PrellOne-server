// Route for Accessing Label Data via Restful API

const router = require('express').Router();
const auth = require('../middlewares/authMiddleware').isAuthenticated;
const asyncWrapper = require('../middlewares/asyncWrapper')
const LabelController = require('../controllers/labelController');


/* GET ALL LABELS */
router.get('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const labels = await LabelController.getAll()
    res.type('application/json')
    res.status(200)
    res.json(labels)
}))

/* GET SINGLE LABEL BY ID */
router.get('/:id', /* auth, */ asyncWrapper( async(req, res, next) => {
    const label = await LabelController.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(label)
}))

module.exports = router;