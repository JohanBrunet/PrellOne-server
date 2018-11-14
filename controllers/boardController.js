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

BoardController.create = async(boardData,ownerId, teamIds = null) => {
    let user = null
    // TODO: create labels for the board
    boardData.members = [ownerId]
    const newBoard = new Board(boardData)
    try {
        console.log("de")
        console.log(ownerId)
        console.log(teamId)
        user = await userController.addBoard(ownerId, newBoard.id)
        if(teamIds) teamController.addBoard(teamId, newBoard.id) // TODO Bottero: Parcourir tous les team ids et addBoard un par un
        return await newBoard.save()
    }
    catch(error) {
        if (user) await user.save()
        throw error
    }
}

BoardController.update = (board, data) => {
    const query = {'id': board.id}
    const options = {new: true, upsert: true}
    return Board.findOneAndUpdate(query, data, options)
}

BoardController.addMember= async (boardId, username) => {
    console.log("Board Id RECEIVED :")
    console.log(boardId)
    const query = {_id: boardId}
    const member = await userController.getByUsername(username)
    if (!member){
        throwError(404, "Member with username not found")
    }
    else {
        const update = {
            $addToSet: {
                members: member._id
            } 
        }
        const options = {new: true, upsert: true}
        const newBoard = await Board.findByIdAndUpdate(query, update, options)
        return member
    }
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