const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose')

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

UserController.getWithBoards = (id) => {
    return User.findById(id).populate('boards')
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

UserController.addBoard = (userId, boardId, session) => {
    const update = { 
        $push: {
            boards: boardId
        } 
    }
    const options = {session, new: true, upsert: true};
    return User.findByIdAndUpdate(userId, update, options);
}

module.exports = UserController;