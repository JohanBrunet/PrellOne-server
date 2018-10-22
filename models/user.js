const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    loginType: {type: String, enum: ['classic', 'ldap', 'oauth']},
    boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
    createdAt: { type: Date, default: Date.now }
});

UserSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

const User = mongoose.model('User', UserSchema)
module.exports = User;