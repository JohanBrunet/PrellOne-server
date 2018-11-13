const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let UserController = () => {}

UserController.getByEmail = (em, withPassword = false) => {
    if (withPassword) return User.findOne({email: em}).select("+password")
    else return User.findOne({email: em})
}

UserController.getByUsername = (uname, withPassword = false) => {
    if (withPassword) return User.findOne({username: uname}).select("+password")
    else return User.findOne({username: uname})
}

UserController.getById = (id) => {
    return User.findById(id);
}

UserController.getAll = () => {
    return User.find();
}

UserController.getWithBoards = (username) => {
    return User.findOne({username: username}).populate('boards', 'title')
}

UserController.getWithTeams=(username)=>{
    return User.findOne(({username: username})).populate({path: 'teams', populate: [{path: 'boards', select: 'title'},{path: 'members'}]})
}

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

UserController.update = (userId, data) => {
    const options = {new: true, upsert: true};
    return User.findByIdAndUpdate(userId, data, options);
}


UserController.updatePassword = async(userId, oldPwd, newPwd) => {
    const user = await User.findById(userId).select('+password')
    if (await authMiddleware.passwordMatch(oldPwd, user.password)) {
        const newPwdHash = await authMiddleware.hashPassword(newPwd)
        return await User.findOneAndUpdate({ _id: userId }, { $set: { "password": newPwdHash } }, { new: true })
    }
    else throwError(400, "Password do not match")
    
}


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