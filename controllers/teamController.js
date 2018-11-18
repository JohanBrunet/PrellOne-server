const Team = require('../models/team')
const userController = require('./userController')
const throwError = require('../utils/throwError')
const boardController=require('./boardController')

let TeamController = () => {}

/*ADD BOARD TO TEAM*/
TeamController.addBoard = async(teamId, boardId) => {
    const team = await Team.findById(teamId)
    console.log(team)
        try {
            if (!team.boards.some(oldBoardId => oldBoardId.equals(boardId))){
                team.boards.push(boardId)
            }
            return team.save()
        }
        catch(error) {
            return Error("Error adding board to team")
        }
    }


/*GET TEAM BY ID*/
TeamController.getById = async(id) => {
    return await Team.findById(id).populate('members')
                                
}

/*GET ALL TEAM*/
TeamController.getAll = async() => {
    return await Team.find();
}

/*GET TEAM BY NAME*/
TeamController.getByName = (name) => {
    return Team.findOne({name: name}).populate('members')
}

/*UPDATE TEAM*/
TeamController.update = (team) => {
    const query = {'_id': team.id}
    const options = {new: true, upsert: true}
    return Team.findOneAndUpdate(query, team, options)
}

/*CREATE A TEAM*/
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
/*ADD MEMBER TO TEAM*/
TeamController.addMember= async (teamId, username) => {
    const query = {_id: teamId}
    const member = await userController.getByUsername(username)
    const team= await Team.findById(teamId)
    
    if (!member){
        throwError(404, "Member with username not found")
    }
    else {
        let array = []
        for (let board of team.boards) {
            array.push(() =>userController.addBoard(member.id,board.id))
        }
        const res = await Promise.all(array)
        const newMember=await userController.addTeam(member.id,teamId)
        const update = {
            $addToSet: {
                members: member._id
            } 
        }
        const options = {new: true, upsert: true}
        const newTeam = await Team.findByIdAndUpdate(query, update, options)
        return newMember
    }
}
module.exports = TeamController;