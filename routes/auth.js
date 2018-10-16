const authenticate = require('../middlewares/auth').doAuthentication;
const AsyncMiddleware = require('../middlewares/asyncWrapper');
const router = require('express').Router;

module.exports = () => {
    
    router.post('/login', AsyncMiddleware( async (req, res, next) => {

        let result = await authenticate(req.body);

        res.cookie('prellone', result);
        res.type('application/json');
        res.status(200);
        return res.json(result);
    }));

    router.get('/logout', (req, res) => {
        res.cookie('prellone', '', {maxAge: 0});
        res.type('text/html');
        res.status(200);
        res.send('');
    });

}