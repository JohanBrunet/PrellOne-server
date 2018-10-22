const router = require('express').Router();
const authenticate = require('../middlewares/authMiddleware').doAuthentication;
const hashPassword = require('../middlewares/authMiddleware').hashPassword;
const asyncWrapper = require('../middlewares/asyncWrapper');
const userController = require('../controllers/userController');

    
    router.post('/login', asyncWrapper( async(req, res, next) => {

        const result = await authenticate(req.body);

        res.cookie('prellone', result);
        res.type('application/json');
        res.status(200);
        return res.json(result);
    }));

    router.post('/signup', asyncWrapper( async(req, res, next) => {
        let newUser = req.body;
        newUser.password = await hashPassword(newUser.password);
        const newUserSaved = await userController.create(newUser);
        delete newUserSaved.password;
        res.status(201)
        return res.json(newUserSaved)
    }));

    router.get('/logout', (req, res) => {
        res.cookie('prellone', '', {maxAge: 0});
        res.type('text/html');
        res.status(204);
        return res.send();
    });

module.exports = router;