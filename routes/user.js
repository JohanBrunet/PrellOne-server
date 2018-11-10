// Route for Accessing User Data via Restful API

const router = require('express').Router();
const auth = require('../middlewares/authMiddleware').isAuthenticated;
const decodeToken = require('../middlewares/authMiddleware').decodeToken;
const asyncWrapper = require('../middlewares/asyncWrapper')
const User = require('../controllers/userController');

/* GET ALL USERS */
router.get('/', auth, asyncWrapper( async(req, res, next) => {
    const users = await User.getAll()
    res.type('application/json')
    res.status(200)
    res.json(users)
}))

/* GET SINGLE USER BY ID */
router.get('/:id', auth, asyncWrapper( async(req, res, next) => {
    const user = await User.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(user)
}))

/* GET SINGLE USER BY ID */
router.get('/current', auth, asyncWrapper( async(req, res, next) => {
    const token = req.get('Authorization').split(' ')[1]
    const currentUserId = decodeToken(token)
    const user = await User.getWithBoards(currentUserId)
    res.type('application/json')
    res.status(200)
    res.json(user)
}))

/* GET USER BOARDS WITH ID */
router.get('/:id/boards', auth, asyncWrapper( async(req, res, next) => {
    const user = await User.getWithBoards(req.params.id)
    res.type('application/json');
    res.status(200);
    res.json(user);
}))

/* GET USER BOARDS WITH USERNAME */
router.get('/:username/boards', auth, asyncWrapper( async(req, res, next) => {
    const user = await User.getWithBoards(req.params.username);
    res.type('application/json');
    res.status(200);
    res.json(user);
}))

/* GET USER TEAMS WITH USERNAME */
router.get('/:username/teams', auth, asyncWrapper( async(req, res, next) => {
    const user = await User.getWithTeams(req.params.username);
    res.type('application/json');
    res.status(200);
    res.json(user);
}))

/* UPDATE USER PASSWORD */
router.put('/:id/password', auth, asyncWrapper( async(req, res, next) => {
    let user = req.params.id
    let newPwd = req.body.newPwd
    let oldPwd = req.body.oldPwd
    const result = await User.updatePassword(user, oldPwd, newPwd)
    res.type('application/json');
    res.status(200);
    return res.json(result);
 }));

 /* UPDATE USER DATA */
router.put('/:id', auth, asyncWrapper( async(req, res, next) => {
    let user = req.params.id
    let data = req.body
    const result = await User.update(user, data)
    res.type('application/json');
    res.status(200);
    return res.json(result);
 }));
 
/* DELETE USER */
// router.delete('/:id', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     User.findByIdAndRemove(req.params.id, req.body, function (err, post) {
//       if (err) return next(err);
//       res.json(post);
//     });
//   }
//   else {
//     res.status(401).send({ msg: 'Unauthorized' });
//   }
// });


module.exports = router;