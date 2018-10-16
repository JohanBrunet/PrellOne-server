const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema({
    title: String,
    board: { 
        type: Schema.Types.ObjectId, 
        ref: 'Board'
    },
    card: { 
        type: Schema.Types.ObjectId, 
        ref: 'Card' 
    },
    position: Number,
    items: [{
        complete: Boolean,
        title: String,
        position: Number
    }]
});

const Checklist = mongoose.model('Card', ChecklistSchema)
module.exports = Checklist;