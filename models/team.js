const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    displayName: {
        type: String
    },
    description: String,
    boards: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Board' 
    }],
    admins: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    members: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }]
}, 
{ timestamps: true });

TeamSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.__v
        return ret
    }
}

let Team
try {
    Team = mongoose.model('Team', TeamSchema)
}
catch(e) {
    Team = mongoose.model('Team')
}
module.exports = Team;