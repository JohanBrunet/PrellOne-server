const Label = require('../models/label')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let LabelController = () => {}

LabelController.getByID = async(id) => {
    return Label.findById(id)
}

LabelController.getAll = async(boardId) => {
    return Label.find({board: boardId})
}

LabelController.create = async(boardId, color, title = null) => {
    const newLabel = new Label({
        board: boardId,
        color: color
    })
    if (title) newLabel.title = title
    try {
        return await newLabel.save()
    }
    catch(error) {
        throw error
    }
}

LabelController.updateTitle = (labelId, title) => {
    const query = {'id': labelId};
    const update = {$set: {'title': title}}
    const options = {new: true, upsert: true};
    return Board.findOneAndUpdate(query, update, options);
}

module.exports = LabelController;