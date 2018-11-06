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

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    const rand = Math.floor(Math.random() * (max - min)) + min
    return rand
}

CardSchema.pre('save', async function(next) {
    if(!this.position) {
        const lastChecklistInCard = await mongoose.model('Checklist', ChecklistSchema).findOne({card: this.card}).sort({'position': -1})
        const lastPosition = lastChecklistInCard ? lastChecklistInCard.position : 0
        let min = lastPosition
        let max = 10000
        this.position = getRandomInt(min, min + max)
    }
    next()
})

ChecklistSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.__v
        return ret
    }
}

let Checklist
try {
    Checklist = mongoose.model('Checklist', ChecklistSchema)
}
catch(e) {
    Checklist = 
    mongoose.model('Checklist')
}
module.exports = Checklist;