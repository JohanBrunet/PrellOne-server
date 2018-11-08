// Route for Accessing User Data via Restful API

const router = require('express').Router();
const auth = require('../middlewares/authMiddleware').isAuthenticated;
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

/* GET USER BOARDS WITH ID */
router.get('/:id/boards', /*auth,*/ asyncWrapper( async(req, res, next) => {
    const user = await User.getWithBoards(req.params.id);
    res.type('application/json');
    res.status(200);
    res.json(user);
}))

/* GET USER BOARDS WITH USERNAME */
router.get('/:username/boards', /*auth,*/ asyncWrapper( async(req, res, next) => {
    const token = req.headers['Authorization']
        console.log('token : ', token)
    const user = await User.getWithBoards(req.params.username);
    res.type('application/json');
    res.status(200);
    res.json(user);
}))

/* GET USER TEAMS WITH USERNAME */
router.get('/:username/teams', /*auth,*/ asyncWrapper( async(req, res, next) => {
    const token = req.headers['Authorization']

    const user = await User.getWithTeams(req.params.username);
    res.type('application/json');
    res.status(200);
    res.json(user);
}))

/* UPDATE USER PASSWORD */
router.put('/:id/password', asyncWrapper( async(req, res, next) => {
    let user = req.params.id
    let newPwd = req.body.newPwd
    let oldPwd = req.body.oldPwd
    const result = await userController.updatePassword(user, oldPwd, newPwd)
    res.type('application/json');
    res.status(200);
    return res.json(result);
 }));

 /* UPDATE USER DATA */
router.put('/:id', asyncWrapper( async(req, res, next) => {
    let user = req.params.id
    let data = req.body
    const result = await userController.update(user, data)
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