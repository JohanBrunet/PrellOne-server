const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    title: String,
    board: { type: Schema.Types.ObjectId, ref: 'Board'},
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    position: Number,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const List = mongoose.model('List', ListSchema)
module.exports = List;