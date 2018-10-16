const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: String,
    description: String,
    board: { 
        type: Schema.Types.ObjectId, 
        ref: 'Board'
    },
    list: { 
        type: Schema.Types.ObjectId, 
        ref: 'List' 
    },
    position: Number,
    due_date: Date,
    closed: Boolean,
    checklists: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Checklist' 
    }],
    labels = [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Label' 
    }],
    members = [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    attachments: [{
        name: String,
        owner: { 
            type: Schema.Types.ObjectId, 
            ref: 'User' 
        },
        size: Number,
        added_at: { type: Date, default: Date.now },
        pos: Number,
        url: String
    }],
    created_at: { type: Date, default: Date.now }
});

const Card = mongoose.model('Card', CardSchema)
module.exports = Card;