const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let UserController = () => {}

UserController.getByEmail = (em) => {
    return User.findOne({email: em});
}

UserController.getByUsername = (uname) => {
    return User.findOne({username: uname});
}

UserController.getByEmailWithPassword = (value) => {
    return User.findOne({email: value}).select("+password");
}

UserController.getByID = (id) => {
    return User.findById(id);
}

UserController.getAll = () => {
    return User.find();
}

UserController.getWithBoards = (username) => {
    return User.findOne({username: username}).populate('boards', 'title')
}

UserController.getWithTeams=(username)=>{
    return User.findOne(({username: username})).populate({path: 'teams', populate: 'boards'})
}

UserController.create = async(data) => {
    let user = data
    if(!user.username) user.username = user.firstName + user.lastName
    user.initials = user.firstName.charAt(0) + user.lastName.charAt(0)
    user.password = await authMiddleware.hashPassword(user.password)
    const newUser = new User(user)
    return newUser.save()
}

UserController.update = (userId, data) => {
    const options = {new: true, upsert: true};
    return User.findByIdAndUpdate(userId, data, options);
}

UserController.addBoard = async(userId, boardId) => {
    const user = await User.findById(userId)
    try {
        await User.updateOne({ id: userID }, {
            $push: { boards: boardId}
        })
        return user
    }
    catch(error) {
        throwError(500, "Update failed")
    }
}

UserController.addBoard = async(userId, boardId) => {
    const user = await User.findById(userId)
        try {
            user.boards.push(boardId)
            team.save()
        }
        catch(error) {
            return Error("Error adding board to team")
        }
    }

module.exports = UserController;