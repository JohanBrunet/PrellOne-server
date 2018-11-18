const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
    title: String,
    board: { 
        type: Schema.Types.ObjectId,  
        ref: 'Board' 
    },
    color: {
        type: String,
        enum: ["primary", "success", "danger", "warning"],
        required: true
    }
}, 
{ timestamps: true });

LabelSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id
        delete ret._id
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.__v
        return ret
    }
}

mongoose.model('Label', LabelSchema)
module.exports = mongoose.model('Label')