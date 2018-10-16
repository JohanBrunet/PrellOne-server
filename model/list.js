const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
    title: String,
    board: { type: Schema.Types.ObjectId, ref: 'Board'},
    cards = [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    position: Number,
    createdAt: { type: Date, default: Date.now }
});

const List = mongoose.model('List', ListSchema)
module.exports = List;