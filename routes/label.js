// Route for Accessing Label Data via Restful API

const router = require('express').Router();
const auth = require('../middlewares/authMiddleware').isAuthenticated;
const asyncWrapper = require('../middlewares/asyncWrapper')
const labelController = require('../controllers/labelController');


/* GET ALL LABELS */
router.get('/',  auth, asyncWrapper( async(req, res, next) => {
    const labels = await labelController.getAll()
    res.type('application/json')
    res.status(200)
    res.json(labels)
}))

/* GET SINGLE LABEL BY ID */
router.get('/:id',  auth, asyncWrapper( async(req, res, next) => {
    const label = await labelController.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(label)
}))

/*CREATE LABEL*/
router.post('/',  auth, asyncWrapper( async(req, res, next) => {
    const newLabel = req.body
    const boardId=req.body.boardId
    //const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const label = await labelController.create(newLabel /*,owner.id*/,boardId)
    res.type('application/json')
    res.status(200)
    res.json(label)
}))

router.put('/', auth, asyncWrapper( async(req, res, next) => {
    const updatedLabel=req.body
    const label= await labelController.update(updatedLabel)
    res.type('application/json')
    res.status(200)
    res.json(label)
}))


module.exports = router;