const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChecklistSchema = new Schema({
    title: String,
    board: { type: Schema.Types.ObjectId, ref: 'Board' },
    card: { type: Schema.Types.ObjectId, ref: 'Card' },
    position: Number,
    items: [{
        complete: Boolean,
        title: String,
        position: Number
    }]
});

const Checklist = mongoose.model('Checklist', ChecklistSchema)
module.exports = Checklist;