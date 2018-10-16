// Route for Accessing User Data via Restful API

const express = require('express');
var router = express.Router();
var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = process.env.CRYPTO_SECRET;
var auth = require('./authentification');
var User = require('../controllers/userController');

/* GET ALL USERS */
router.get('/', auth, AsyncMiddleware( async (req, res, next) => {
    const users = await User.getAll();

    res.type('application/json');
    res.status(200);
    res.json(users);
}));

/* GET SINGLE USER BY ID */
router.get('/', auth, AsyncMiddleware( async (req, res, next) => {
    const user = await User.getById(req.params.id);

    res.type('application/json');
    res.status(200);
    res.json(user);
}));

// TODO: update signin, modifiy user and delete user

/* SAVE USER */
// router.post('/register', function (req, res, next) {
//   User.findOne({ email: req.body.email }, function (err, user) {
//     if (user) {
//       res.status(400);
//       res.json({ msg: 'The email address you have entered is already associated with another account.' });
//     }
//     else {
//       req.body.pwd = auth.encrypt(req.body.pwd);
//       User.create(req.body, function (err, post) {
//         if (err) return next(err);
//         res.json({ token: auth.generateToken(post._id), user: post });
//       });
//     }
//   });
// });

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