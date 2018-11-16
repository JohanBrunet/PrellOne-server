const Team = require('../models/team')
const userController = require('./userController')
const throwError = require('../utils/throwError')

let TeamController = () => {}

TeamController.addBoard = async(teamId, boardId) => {
    const team = await Team.findById(teamId)
        try {

            team.boards.push(boardId)
    
            team.save()
        }
        catch(error) {
            return Error("Error adding board to team")
        }
    }


TeamController.getById = async(id) => {
    return await Team.findById(id).populate('members')
                                
}

TeamController.getAll = async() => {
    return await Team.find();
}

TeamController.getByName = (name) => {
    return Team.findOne({name: name}).populate('members')
}

TeamController.update = (team) => {
    const query = {'_id': team.id}
    const options = {new: true, upsert: true}
    return Team.findOneAndUpdate(query, team, options)
}

TeamController.create = async(teamData,ownerId) => {
    try {
        const newTeam = await new Team(teamData)
        const user=await userController.addTeam(ownerId, newTeam.id)
        return newTeam.save()
    }
    catch(error) {
        throwError(500, error)
    }
}

TeamController.addMember= async (teamId, username) => {
    const query = {_id: teamId}
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
        const newTeam = await Team.findByIdAndUpdate(query, update, options)
        return member
    }
}
module.exports = TeamController;