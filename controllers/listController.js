const List = require('../models/list');
const BoardController = require('./boardController')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let ListController = () => {}

ListController.getByID = (id) => {
    return List.findById(id).populate('cards')
                            .populate('labels')
}

ListController.getAll = (boardId) => {
    return List.find({board: boardId}).populate('cards')
                                      .populate('labels')
}

ListController.create = async(listData,boardId) => {
    try {
        const newList = new List(listData)
        await BoardController.addList(boardId, newList.id)
        return newList.save()
    }
    catch(error) {
        throwError(500, error)
    }
}

ListController.update = (list, data) => {
    const query = {'id': list.id}
    const options = {new: true, upsert: true}
    return List.findOneAndUpdate(query, data, options)
}

ListController.addCard = (listId, cardId) => {
    const update = {
        $push: {
            cards: cardId
        } 
    }
    const options = {new: true, upsert: true}
    return List.findByIdAndUpdate(listId, update, options)
}

module.exports = ListController;