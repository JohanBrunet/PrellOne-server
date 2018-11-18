const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthAuthorizationCode = new Schema({
    authorizationCode: String,
    expiresAt: Date,
    redirect_uri: String,
    scope: String,
    client: { 
        id: { type: String }
    },
    user: { type: Object }
})


mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCode);
module.exports = mongoose.model('OAuthAuthorizationCode');