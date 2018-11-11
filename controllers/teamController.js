const Team = require('../models/team')
const userController = require('./userController')

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

TeamController.addMember=(userId,teamId)=>{
    const query = {_id: teamId}
    const update = {
        $push: {
            members: userId
        } 
    }
    const options = {new: true, upsert: true}
    return Team.findByIdAndUpdate(query, update, options)
}
module.exports = TeamController;