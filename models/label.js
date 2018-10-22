const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
    name: String,
    board: { type: Schema.Types.ObjectId,  ref: 'Board' },
    color: String
});

const Label = mongoose.model('Label', LabelSchema)
module.exports = Label;