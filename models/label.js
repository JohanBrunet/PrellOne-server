const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
    name: String,
    board: { type: Schema.Types.ObjectId,  ref: 'Board' },
    color: {
        type: String,
        enum: ["yellow", "purple", "blue", "red", "green", "orange", "black", "deepskyblue", "pink", "lime"]
    }
}, { timestamps: true });

const Label = mongoose.model('Label', LabelSchema)
module.exports = Label;