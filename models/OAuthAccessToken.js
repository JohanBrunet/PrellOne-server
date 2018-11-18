const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OAuthAccessTokenSchema = new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client: {
        id: { type: String }
    },
    user: { type: Object }
})

mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema)
module.exports = mongoose.model('OAuthAccessToken')