// Route for Accessing List Data via Restful API

const router = require('express').Router();
const auth = require('../middlewares/authMiddleware').isAuthenticated;
const asyncWrapper = require('../middlewares/asyncWrapper')
const ListController = require('../controllers/listController');

/* GET ALL LISTS*/
router.get('/',  auth, asyncWrapper( async(req, res, next) => {
    const lists = await ListController.getAll();
    res.type('application/json');
    res.status(200);
    res.json(lists);
}));

/* GET SINGLE LIST BY ID */
router.get('/:id',  auth, asyncWrapper( async(req, res, next) => {
    const list = await ListController.getById(req.params.id);
    res.type('application/json');
    res.status(200);
    res.json(list);
}));

/*CREATE A LIST*/
router.post('/',  auth, asyncWrapper( async(req, res, next) => {
    const newList = req.body;
    const boardId = req.body.board;
    const list = await ListController.create(newList,boardId);
    res.type('application/json');
    res.status(200);
    res.json(list);
}))

/*UPDATE LIST*/
router.put('/', auth, asyncWrapper( async(req, res, next) => {
    const updatedList = req.body
    const list = await ListController.update(updatedList)
    res.type('application/json')
    res.status(200)
    res.json(list)
}))

/*UPDATE TITLE LIST*/
router.put('/title', auth, asyncWrapper( async(req, res, next) => {
    const updatedList = req.body
    const list = await ListController.updateTitle(updatedList)
    res.type('application/json')
    res.status(200)
    res.json(list)
}))

module.exports = router;