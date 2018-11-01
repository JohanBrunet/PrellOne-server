const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    title: String,
    description: String,
    board: { type: Schema.Types.ObjectId, ref: 'Board'},
    list: { type: Schema.Types.ObjectId, ref: 'List' },
    position: Number,
    dueDate: Date,
    closed: Boolean,
    checklists: [{ type: Schema.Types.ObjectId, ref: 'Checklist' }],
    labels: [{ type: Schema.Types.ObjectId, ref: 'Label' }],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attachments: [{
        name: String,
        owner: { type: Schema.Types.ObjectId, ref: 'User' },
        size: Number,
        addedAt: { type: Date, default: Date.now },
        pos: Number,
        url: String
    }],
    comments: [{
        text: String,
        writer: { type: Schema.Types.ObjectId, ref: 'User' },
        addedAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Card = mongoose.model('Card', CardSchema)
module.exports = Card;