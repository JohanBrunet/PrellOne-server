const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    title: {
        type: String,
        required: true
    },
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
    dueDate: Date,
    closed: Boolean,
    checklists: [{
        type: Schema.Types.ObjectId,
        ref: 'Checklist'
    }],
    labels: [{
        type: Schema.Types.ObjectId,
        ref: 'Label'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attachments: [{
        name: String,
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User' },
        size: Number,
        pos: Number,
        url: String
    }, { timestamps: true }],
    comments: [{
        content: String,
        writer: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, { timestamps: true }]
}, 
{ timestamps: true });

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    const rand = Math.floor(Math.random() * (max - min)) + min
    return rand
}

CardSchema.pre('save', async function(next) {
    if(!this.position) {
        const lastCardInList = await mongoose.model('Card', CardSchema).findOne({list: this.list}).sort({'position': -1})
        const lastPosition = lastCardInList ? lastCardInList.position : 0
        let min = lastPosition
        let max = 10000
        this.position = getRandomInt(min, min + max)
    }
    next()
})

let Card
try {
    Card = mongoose.model('Card', CardSchema)
} 
catch (e) {
    Card = mongoose.model('Card')
}
module.exports = Card;