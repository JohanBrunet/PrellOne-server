const Board = require('../models/board')
const userController = require('./userController')
const teamController=require('./teamController')

let BoardController = () => {}

BoardController.getById = async(id) => {
    return await Board.findById(id).populate({ path: 'lists', populate: { path: 'cards' }})
                             .populate('members')
                             .populate('teams')
                             .populate('labels')
}

BoardController.getAll = async() => {
    return await Board.find();
}

BoardController.create = async(boardData,ownerId, teamId = null) => {
    // TODO: create labels for the board
    const newBoard = new Board(boardData)
    try {
        console.log("de")
        console.log(ownerId)
        console.log(teamId)
        const user=await userController.addBoard(ownerId, newBoard.id)
        if(teamId) teamController.addBoard(teamId, newBoard.id)
        return await newBoard.save()
    }
    catch(error) {
        //if (user) await user.save()
        throw error
    }
}

BoardController.update = (board, data) => {
    const query = {'id': board.id}
    const options = {new: true, upsert: true}
    return Board.findOneAndUpdate(query, data, options)
}

BoardController.addMembers = async(boardId, membersIds) => {
    const board = await Board.findById(boardId)
    const addMember = async(memberId) => {
        try {
            const user = await userController.addBoard(memberId, boardId)
            board.members.push(user.id)
            board.save()
        }
        catch(error) {
            return Error("Error adding board to user")
        }
    }
    let array = []
    for (let memberId of membersIds) {
        array.push(addMember(memberId))
    }
    // TODO: finish implementation
}

BoardController.addList = async(boardId, listId) => {
    const query = {_id: boardId}
    const update = {
        $push: {
            lists: listId
        } 
    }
    const options = {new: true, upsert: true}
    return await Board.findOneAndUpdate(query, update, options)
}
BoardController.addLabel = async(boardId, labelId) => {
    const query = {_id: boardId}
    const update = {
        $push: {
            labels: labelId
        } 
    }
    const options = {new: true, upsert: true}
    return await Board.findOneAndUpdate(query, update, options)
}


module.exports = BoardController;