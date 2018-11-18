const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'Card'
    }],
    position: {
        type: Number,
        require: true
    }
}, 
{ timestamps: true });

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    const rand = Math.floor(Math.random() * (max - min)) + min
    return rand
}

ListSchema.pre('save', async function(next) {
    if(!this.position) {
        const lastListInBoard = await mongoose.model('List', ListSchema).findOne({board: this.board}).sort({'position': -1})
        const lastPosition = lastListInBoard ? lastListInBoard.position : 0
        let min = lastPosition
        let max = 10000
        this.position = getRandomInt(min, min + max)
    }
    next()
})

ListSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.__v
        return ret
    }
}

mongoose.model('List', ListSchema)
module.exports = mongoose.model('List')