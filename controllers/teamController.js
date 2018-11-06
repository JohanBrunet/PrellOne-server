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

module.exports = TeamController;