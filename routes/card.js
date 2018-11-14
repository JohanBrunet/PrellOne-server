// Route for Accessing Card Data via Restful API

const router = require('express').Router()
const auth = require('../middlewares/authMiddleware').isAuthenticated
const asyncWrapper = require('../middlewares/asyncWrapper')
const cardController = require('../controllers/cardController')
const fs = require('fs')
const google = require('../utils/google')

const content = {
    installed: {
      client_id: "741754501698-vobipll9beet35bmoml9ovrcou4i1rbh.apps.googleusercontent.com",
      project_id: "prello-1542055414931",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://www.googleapis.com/oauth2/v3/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_secret: "Fj8wdAcxcqKpjFCL0YXQPrwj",
      redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
    }
}

// Attach Google Drive file 
router.get('/googleFiles',/* auth, */ (req, res, next) => {
    // Load client secrets from a local file.
    //fs.readFile('../config/googleCredentials.json', (err, content) => {
    //    if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        console.log(content)
        google.authorize(content, google.listFiles);
    //  google.authorize(JSON.parse(content), google.listFiles);
    //});
    
    res.type('application/json')
    res.status(200)
})

/* GET ALL CARDS */
router.get('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const cards = await cardController.getAll()
    res.type('application/json')
    res.status(200)
    res.json(cards)
}))

/* GET SINGLE CARD BY ID */
router.get('/:id', /* auth, */ asyncWrapper( async(req, res, next) => {
    const card= await cardController.getById(req.params.id)
    res.type('application/json')
    res.status(200)
    res.json(card)
}))
/* CREATE A NEW CARD */
router.post('/', /* auth, */ asyncWrapper( async(req, res, next) => {
    const newCard = req.body
    const listId = req.body.list
    const card = await cardController.create(newCard,listId)
    res.type('application/json')
    res.status(200)
    res.json(card)
}))

router.put('/',/* auth, */ asyncWrapper( async(req, res, next) => {
    const updatedCard=req.body
    const card = await cardController.update(updatedCard)
    res.type('application/json')
    res.status(200)
    res.json(card)
}))

router.put('/updateDesc',/* auth, */ asyncWrapper( async(req, res, next) => {
    const desc=req.body.desc
    const idCard=req.body.idCard
    //const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const card = await cardController.updateDesc(desc,idCard/*,owner.id*/)
    res.type('application/json')
    res.status(200)
    res.json(card)
}))

router.put('/addMember',/* auth, */ asyncWrapper( async(req, res, next) => {
    const username = req.body.username
    const cardId = req.body.cardId
    //const owner = decodeToken(req.cookies.prellone.appAuthToken)
    const member = await cardController.addMember(cardId, username/*,owner.id*/)
    console.log("FOUND MEMBER")
    console.log(member)
    res.type('application/json')
    res.status(200)
    res.json(member)
}))

module.exports = router;