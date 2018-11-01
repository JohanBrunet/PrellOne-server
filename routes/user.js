// Route for Accessing User Data via Restful API

const router = require('express').Router();
const auth = require('../middlewares/authMiddleware').isAuthenticated;
const asyncWrapper = require('../middlewares/asyncWrapper')
const User = require('../controllers/userController');

/* GET ALL USERS */
router.get('/', auth, asyncWrapper( async(req, res, next) => {
    const users = await User.getAll();

    res.type('application/json');
    res.status(200);
    res.json(users);
}));

/* GET SINGLE USER BY ID */
router.get('/:id', auth, asyncWrapper( async(req, res, next) => {
    const user = await User.getById(req.params.id);

    res.type('application/json');
    res.status(200);
    res.json(user);
}));

// TODO: update user and delete user

/* UPDATE USER */
// router.put('/:id', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     req.body.pwd = auth.encrypt(req.body.pwd);
//     User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//       if (err) return next(err);
//       res.json(post);
//     });
//   } else {
//     res.status(401).send({ msg: 'Unauthorized' });
//   }
// });

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