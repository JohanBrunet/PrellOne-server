const mongoose = require('mongoose')
const Schema = mongoose.Schema

var OAuthAccessTokenSchema = new Schema({
    accessToken: { type: String },
    accessTokenExpiresOn: { type: Date },
    client: { type: Schema.Types.ObjectId, ref: "OAuthClient" },
    user: { type: Schema.Types.ObjectId, ref: "User" }
})

mongoose.model('OAuthAccessToken', OAuthAccessTokenSchema)
module.exports = mongoose.model('OAuthAccessToken')