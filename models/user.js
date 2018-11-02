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
    initials: {
        type: String
    },
    profilePicture: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    loginType: {
        type: String, 
        enum: ['classic', 'ldap', 'oauth'], 
        default: 'classic'
    },
    boards: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Board' 
    }],
    teams: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Team' 
    }]
}, 
{ timestamps: true })

UserSchema.pre('save', async function(next) {
    const user = await mongoose.model('user').findOne({email: this.email});
    if(user) throwError(400, "This email already exists!")
    next()
})
.pre('save', async function(next) {
    const user = await mongoose.model('user').findOne({username: this.username});
    if(user) throwError(400, "This username is already taken!")
    next()
})

UserSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        return ret
    }
};

let User
try {
    User = mongoose.model('User', UserSchema)
}
catch(e) {
    User = mongoose.model('User')
}
module.exports = User