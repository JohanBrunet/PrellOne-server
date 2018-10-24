const User = require('../models/user');
const hashPassword = require('../middlewares/authMiddleware').hashPassword;

let UserController = () => {}

UserController.getByEmail = (em) => {
    return User.findOne({email: em});
}

UserController.getByID = (id) => {
    return User.findById(id);
}

UserController.getAll = () => {
    return User.find();
}

UserController.create = async(data) => {
    let user = data
    user.password = await hashPassword(user.password)
    return new User(user).save();
}

UserController.update = (user, data) => {
    const query = {'id': user.id};
    const options = {new: true, upsert: true};
    return User.findOneAndUpdate(query, data, options);
}

module.exports = UserController;