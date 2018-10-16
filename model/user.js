const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    email: String,
    password: String,
    loginType: String,
    boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema)
module.exports = User;