const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OAuthAuthorizationCode = new Schema({
    authorizationCode: String,
    expiresAt: Date,
    redirect_uri: String,
    scope: String,
    client: { type: Schema.Types.ObjectId, ref: 'OAuthClient' },
    user: { type: Object }
})


mongoose.model('OAuthAuthorizationCode', OAuthAuthorizationCode);
module.exports = mongoose.model('OAuthAuthorizationCode');