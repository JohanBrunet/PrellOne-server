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

TeamController.create = async(teamData) => {
    try {
        const newTeam = new Team(teamData)
        return newTeam.save()
    }
    catch(error) {
        throwError(500, error)
    }
}
module.exports = TeamController;