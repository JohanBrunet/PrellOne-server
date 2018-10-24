const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    loginType: {type: String, enum: ['classic', 'ldap', 'oauth'], default: 'classic'},
    boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    const user = await mongoose.model('User', UserSchema).findOne({email: this.email});
    if(user) {
        let err = new Error("This email already exists!")
        err.statusCode = 400
        throw err
    }
    next()
})

UserSchema.pre('save', async function(next) {
    const user = await mongoose.model('User', UserSchema).findOne({username: this.username});
    if(user) {
        let err = new Error("This username is already taken!")
        err.statusCode = 400
        throw err
    }
    next()
})

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