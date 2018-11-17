const Board = require('../models/board')
const userController = require('./userController')
const teamController=require('./teamController')

let BoardController = () => {}

BoardController.getById = async(id) => {
    return await Board.findById(id).populate({ path: 'lists', populate: { path: 'cards' }})
                             .populate('members')
                             .populate({path:'teams',populate:{path:'members'}})
                             .populate('labels')
}

BoardController.getAll = async() => {
    return await Board.find();
}

BoardController.create = async(boardData,ownerId, team = null) => {
    let user = null
    let newBoard
    // TODO: create labels for the board
    try {
        if(team){
                boardData.members=[]
                for (member of team.members) {
                    boardData.members.push(member.id)
                }
                boardData.teams=[team.id]
                newBoard = new Board(boardData)
                const newteam=await teamController.addBoard(team.id, newBoard.id)
                for (member of team.members) {
                    user = await userController.addBoard(member.id, newBoard.id)
                }
        } else{
            boardData.members = [ownerId]
            newBoard = new Board(boardData)
            user = await userController.addBoard(ownerId, newBoard.id)
        } 
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
        await userController.addBoard(member._id, newBoard._id)
        return member
    }
}

BoardController.addTeam= async (boardId, name) => {
    const query = {_id: boardId}
    const team = await teamController.getByName(name)
    if (!team){
        throwError(404, "Team with name not found")
    }
    else {
        const update = {
            $addToSet: {
                teams: team._id,
                members: team.members
            }
        }
        const options = {new: true, upsert: true}
        const newBoard = await Board.findByIdAndUpdate(query, update, options)
        await teamController.addBoard(team._id, newBoard._id)
        console.log("Returned Team")
        console.log(team)
        return team
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