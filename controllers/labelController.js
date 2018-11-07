const Label = require('../models/label')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')
const BoardController=require('../controllers/boardController')

let LabelController = () => {}

LabelController.getById = (id) => {
    return Label.findById(id)
}

LabelController.getAll = (boardId) => {
    return Label.find({board: boardId})
}

LabelController.getAll = () => {
    return Label.find()
}

LabelController.create = async(labelData,boardId) => {
    try {
        const newLabel = new Label(labelData)
        await BoardController.addLabel(boardId,newLabel.id)
        return newLabel.save()
    }
    catch(error) {
        throwError(500, error)
    }
}

LabelController.update = (newLabel) => {
    const query = {'_id': newLabel.id}
    const options = {new: true, upsert: true}
    return Label.findOneAndUpdate(query, newLabel, options)
}

module.exports = LabelController;