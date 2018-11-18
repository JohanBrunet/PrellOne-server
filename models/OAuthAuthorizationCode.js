const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthAuthorizationCode = new Schema({
    authorizationCode: String,
    expiresOn: Date,
    redirectUri: String,
    scope: String,
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})


mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCode);
module.exports = mongoose.model('OAuthAuthorizationCode');