const router = require('express').Router();
const authenticate = require('../middlewares/authMiddleware').doAuthentication;
const asyncWrapper = require('../middlewares/asyncWrapper');
const userController = require('../controllers/userController');

    
    router.post('/login', asyncWrapper( async(req, res, next) => {
        const result = await authenticate(req.body.email, req.body.password);
        let user = await userController.getWithBoards(result.id)
        user = user.toJSON()
        delete user.password

        res.cookie('prellone', result);
        res.type('application/json');
        res.status(200);
        return res.json(result);
    }));

    router.post('/signup', asyncWrapper( async(req, res, next) => {
        let newUser = req.body;
        let newUserSaved = await userController.create(newUser);
        console.log(newUserSaved)
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