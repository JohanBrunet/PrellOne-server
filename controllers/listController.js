const List = require('../models/list');
const BoardController = require('./boardController')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let ListController = () => {}

ListController.getByID = (id) => {
    return List.findById(id).populate('cards')
}

ListController.getAll = () => {
    return Board.find();
}

ListController.create = async(listData) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const newList = await List.create([listData], { session: session })
        console.log(newList)
        if(userId) BoardController.addList(listData.board, newList.id, session)
        if(teamId) TeamController.addBoard(teamId, newBoard.id)

        // throwError(500, 'Internal server error')

        session.commitTransaction()
        session.endSession()
        return newList
    }
    catch(error) {
        session.abortTransaction()
        session.endSession()
        throw error
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