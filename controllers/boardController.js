const Board = require('../models/board')
const userController = require('./userController')
const teamController = require('./teamController')
const throwError = require('../utils/throwError')
const Label = require('../models/label')

let BoardController = () => { }
/*GET A BOARD BY ID*/
BoardController.getById = async (id) => {
    return await Board.findById(id).populate({ path: 'lists', populate: { path: 'cards' } })
        .populate('members')
        .populate({ path: 'teams', populate: { path: 'members' } })
        .populate('labels')
}
/*GET ALL BOARD*/
BoardController.getAll = async () => {
    return await Board.find();
}
/*CREATE A BOARD*/
BoardController.create = async (boardData, ownerId, team = null) => {
    let user = null
    let newBoard
    let labelColors = [{color:"primary",title:"Optionnel"}, {color:"success",title:"Low"}, {color:"danger",title:"Important"}, {color:"warning",title:"Urgent"}]

    try {
        if (team) {
            boardData.members = []
            for (member of team.members) {
                boardData.members.push(member.id)
            }
            boardData.teams = [team.id]
            newBoard = new Board(boardData)
            const newteam = await teamController.addBoard(team.id, newBoard.id)
            for (member of team.members) {
                user = await userController.addBoard(member.id, newBoard.id)
            }
        } else {
            boardData.members = [ownerId]
            newBoard = new Board(boardData)
            user = await userController.addBoard(ownerId, newBoard.id)
        }
        let labels = []
        for (const color of labelColors) {
            const label = new Label({
                title:color.title,
                board: newBoard.id,
                color: color.color
            })
            const newLabel = await label.save()
            labels.push(newLabel._id)
        }
        newBoard.labels=labels
    
        return await newBoard.save()
    }
    catch (error) {
        console.log(error)
        if (user) await user.save()
        throw error
    }
}

/*UPDATE A BOARD*/
BoardController.update = (board, data) => {
    const query = { 'id': board.id }
    const options = { new: true, upsert: true }
    return Board.findOneAndUpdate(query, data, options)
}

/*ADD MEMBER TO BOARD*/
BoardController.addMember = async (boardId, username) => {
    const query = { _id: boardId }
    const member = await userController.getByUsername(username)

    const hasBoard = await userController.hasBoard(member, boardId)
    if (!member) {
        throwError(404, "Member with username not found")
    }
    else if (hasBoard) {
        throwError(400, "Board already added")
    }
    else {
        const update = {
            $addToSet: {
                members: member._id
            }
        }
        const options = { new: true, upsert: true }
        const newBoard = await Board.findByIdAndUpdate(query, update, options)
        const newMember = await userController.addBoard(member._id, newBoard._id)
        const io = require('../index').io
        const payload = { member: newMember, id: boardId }
        io.to(newBoard._id).emit("action", {
            type: "MEMBER_ADDED_BOARD_SUCCESS",
            payload
        })
        return newMember
    }
}

/*ADD TEAM TO BOARD*/
BoardController.addTeam = async (boardId, name) => {
    const query = { _id: boardId }
    const team = await teamController.getByName(name)
    if (!team) {
        throwError(404, "Team with name not found")
    }
    else {
        const update = {
            $addToSet: {
                teams: team._id,
                members: team.members
            }
        }
        const options = { new: true, upsert: true }
        const newBoard = await Board.findByIdAndUpdate(query, update, options)

        const newTeam = await teamController.addBoard(team._id, newBoard._id)
        const io = require('../index').io
        const payload = { team: team, id: boardId }
        io.to(newBoard._id).emit("action", {
            type: "TEAM_ADDED_BOARD_SUCCESS",
            payload
        })
        return team
    }
}

/*ADD LIST TO BOARD*/
BoardController.addList = async (boardId, listId) => {
    const query = { _id: boardId }
    const update = {
        $push: {
            lists: listId
        }
    }
    const options = { new: true, upsert: true }
    return await Board.findOneAndUpdate(query, update, options)
}

/*ADD LABEL*/
BoardController.addLabel = async (boardId, labelId) => {
    const query = { _id: boardId }
    const update = {
        $push: {
            labels: labelId
        }
    }
    const options = { new: true, upsert: true }
    return await Board.findOneAndUpdate(query, update, options)
}


module.exports = BoardController;