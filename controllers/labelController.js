const Label = require('../models/label')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')
const BoardController=require('../controllers/boardController')

let LabelController = () => {}

/*GET LABEL BY ID*/
LabelController.getById = (id) => {
    return Label.findById(id)
}
/*GET ALL LABEL OF A BOARD*/
LabelController.getAll = (boardId) => {
    return Label.find({board: boardId})
}
/*GET ALL LABEL*/
LabelController.getAll = () => {
    return Label.find()
}
/*CREATE LABEL*/
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
/*UPDATE A LABEL */
LabelController.update = async(newLabel) => {
    const query = {'_id': newLabel.id}
    const options = {new: true, upsert: true}
    updatedLabel =await Label.findOneAndUpdate(query, newLabel, options)
    const io=require('../index').io
        io.to(updatedLabel.board).emit("action",{type:"TITLE_LABEL_UPDATED_SUCCESS",
        label:updatedLabel})
    return updatedLabel
}

module.exports = LabelController;