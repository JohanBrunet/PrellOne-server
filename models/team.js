const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    name: String,
    displayName: String,
    description: String,
    boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', TeamSchema)
module.exports = Team;