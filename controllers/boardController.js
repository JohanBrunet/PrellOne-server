const Board = require('../models/Board');
const UserController = require('./userController')
const mongoose = require('mongoose')

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
    // const session = await mongoose.startSession()
    // session.startTransaction()
    try {
        const board = new Board(boardData);
        const newBoard = await board.save()
        if(userId) UserController.addBoard(userId, newBoard.id, session)
        // if(teamId) TeamController.addBoard(teamId, newBoard.id)
        // session.commitTransaction()
        // session.endSession()
        return newBoard
    }
    catch(error) {
        // session.abortTransaction()
        // session.endSession()
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
    const options = {new: true, upsert: true};
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