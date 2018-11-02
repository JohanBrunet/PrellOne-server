const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChecklistSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    board: { 
        type: Schema.Types.ObjectId, 
        ref: 'Board' 
    },
    card: { 
        type: Schema.Types.ObjectId, 
        ref: 'Card' 
    },
    position: {
        type: Number,
        required: true
    },
    items: [{
        complete: Boolean,
        title: String,
        position: Number
    }]
}, 
{ timestamps: true });

let Checklist
try {
    Checklist = mongoose.model('Checklist', ChecklistSchema)
}
catch(e) {
    Checklist = 
    mongoose.model('Checklist')
}
module.exports = Checklist;