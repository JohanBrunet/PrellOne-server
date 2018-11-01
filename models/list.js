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
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    position: {
        type: Number,
        require: true
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

ListSchema.pre('save', async function(next) {
    if(!this.position) {
        const lastPosition = await mongoose.model('List', ListSchema).findOne({board: this.board}).sort({"-position": -1})
        let min = 0
        let max = 10000
        if(!lastPosition) {
            this.postion = getRandomInt(min, max)
        }
        else {
            min = lastPosition
            max = max + min
            this.position = getRandomInt(min, max)
        }
    }
    next()
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const List = mongoose.model('List', ListSchema)
module.exports = List;