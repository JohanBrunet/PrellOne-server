const Board = require('../models/board');
const UserController = require('./userController')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let BoardController = () => {}

BoardController.getByID = (id) => {
    return Board.findById(id).populate({ path: 'lists', populate: { path: 'cards' }})
                             .populate('members')
                             .populate('labels')
                             .populate('Team')
}

BoardController.getAll = () => {
    return Board.find();
}

BoardController.create = async(boardData, userId = null, teamId = null) => {
    const session = await mongoose.connection.startSession()
    session.startTransaction()
    try {
        const newBoard = await Board.create([boardData], { session: session })
        console.log(newBoard[0])
        if(userId) UserController.addBoard(userId, newBoard.id, session)
        if(teamId) TeamController.addBoard(teamId, newBoard.id)

        await session.commitTransaction()
        session.endSession()
        return newBoard[0]
    }
    catch(error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
}

BoardController.update = (board, data) => {
    const query = {'id': board.id};
    const options = {new: true, upsert: true};
    return Board.findOneAndUpdate(query, data, options);
}

BoardController.addList = async(boardId, listId) => {
    const query = {'id': boardId}
    const update = {
        $push: {
            lists: listId
        } 
    }
    console.log(update)
    const options = {new: true, upsert: true}
    try {
        const board = await Board.findOneAndUpdate(query, update, options)
        console.log(board)
        return board
    }
    catch(error) {
        throw error
    }
}

module.exports = BoardController;