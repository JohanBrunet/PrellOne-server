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

BoardController.create = async(boardData, ownerId, teamId = null) => {
    const newBoard = new Board(boardData)
    newBoard.owner = ownerId
    const user = null
    try {
        user = UserController.addBoard(ownerId, newBoard.id)
        if(teamId) TeamController.addBoard(teamId, newBoard.id)

        throwError(500, "board not saved")
        return await newBoard.save()
    }
    catch(error) {
        if (user) await user.save()
        throw error
    }
}

BoardController.update = (board, data) => {
    const query = {'id': board.id};
    const options = {new: true, upsert: true};
    return Board.findOneAndUpdate(query, data, options);
}

BoardController.addMembers = async(boardId, membersIds) => {
    const board = await Board.findById(boardId)
    const addMember = async(memberId) => {
        try {
            const user = await UserController.addBoard(memberId, boardId)
            board.members.push(user.id)
            board.save()
        }
        catch(error) {

        }
    }
    let array = []
    for (let memberId of membersIds) {
        array.push(addMember(memberId))
    }

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