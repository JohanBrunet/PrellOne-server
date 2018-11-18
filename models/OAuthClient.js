const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OAuthClientSchema = new Schema({
    name: { type: String },
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array },
    grants: { type: Array }
})

mongoose.model('OAuthClient', OAuthClientSchema)
module.exports = mongoose.model('OAuthClient')
