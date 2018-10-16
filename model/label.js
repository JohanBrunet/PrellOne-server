const mongoose = require('mongoose');

const LabelSchema = new mongoose.Schema({
    name: String,
    board: { type: Schema.Types.ObjectId,  ref: 'Board' },
    color: String
});

const Label = mongoose.model('Label', LabelSchema)
module.exports = Label;