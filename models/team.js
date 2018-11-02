const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
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

let Team
try {
    Team = mongoose.model('Team', TeamSchema)
}
catch(e) {
    Team = mongoose.model('Team')
}
module.exports = Team;