const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let UserController = () => {}

/*GET USER LOGIN*/
UserController.getUserLogin = (cred) => {
    return User.findOne({ $or: [{username: cred}, {email: cred}]}).select("+password")
}

/*GET USER BY USERNAME*/
UserController.getByUsername = (uname) => {
    return User.findOne({username: uname})
}

/*GET USER BY ID*/
UserController.getById = (id) => {
    return User.findById(id);
}

/*GET ALL USER*/
UserController.getAll = () => {
    return User.find();
}

/*GET USER WITH BOARD*/
UserController.getWithBoards = (username) => {
    return User.findOne({username: username}).populate('boards', 'title')
}

/*GET USER WITH TEAM*/
UserController.getWithTeams=(username)=>{
    return User.findOne(({username: username})).populate({path: 'teams', populate: [{path: 'boards', select: 'title'},{path: 'members'}]})
}

/*CREATE A NEW USER*/
UserController.create = async(data) => {
    let user = data
    if(!user.username) user.username = user.firstname + user.lastname
    user.initials = user.firstname.charAt(0) + user.lastname.charAt(0)
    if (user.password) {
        user.password = await authMiddleware.hashPassword(user.password)
    }
    const newUser = new User(user)
    return newUser.save()
}

/*UPDATE USER*/
UserController.update = (userId, data) => {
    const options = {new: true, upsert: true};
    return User.findByIdAndUpdate(userId, data, options);
}

/*UPDATE PASSWORD*/
UserController.updatePassword = async(userId, oldPwd, newPwd) => {
    const user = await User.findById(userId).select('+password')
    if (await authMiddleware.passwordMatch(oldPwd, user.password)) {
        const newPwdHash = await authMiddleware.hashPassword(newPwd)
        return await User.findOneAndUpdate({ _id: userId }, { $set: { "password": newPwdHash } }, { new: true })
    }
    else throwError(400, "Password do not match")
    
}
/*USER HAS THIS BOARD */
UserController.hasBoard = async(user, boardId) => {
    console.log(user.boards.some(oldBoardId => oldBoardId.equals(boardId)))
    return user.boards.some(oldBoardId => oldBoardId.equals(boardId))
}

/*ADD BOARD TO USER*/
UserController.addBoard = async(userId, boardId) => {
    const user = await User.findById(userId)
    try {
        await User.findOneAndUpdate({ _id: userId }, {
            $push: { boards: boardId }
        })
        return user
    }
    catch(error) {
        throwError(500, "Update failed")
    }
}

/*ADD TEAM TO USER*/
UserController.addTeam = async(userId, teamId) => {
    const user = await User.findById(userId)
    try {
        await User.updateOne({ _id: userId }, {
            $push: { teams: teamId}
        })
        return user
    }
    catch(error) {
        throwError(500, "Update failed")
    }
}



module.exports = UserController;