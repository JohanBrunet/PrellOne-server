const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: String,
    description: String,
    lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    labels: [{ type: Schema.Types.ObjectId, ref: 'Label' }],
    visibility: {type: String, enum: ['public', 'private', 'team']},
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Board = mongoose.model('Board', BoardSchema)
module.exports = Board;