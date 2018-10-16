const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
    created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema)
module.exports = User;