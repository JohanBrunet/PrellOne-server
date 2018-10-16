const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    title: String,
    description: String,
    lists = [{ type: Schema.Types.ObjectId, ref: 'List' }],
    labels = [{ type: Schema.Types.ObjectId, ref: 'Label' }],
    members = [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

const Board = mongoose.model('Board', BoardSchema)
module.exports = Board;