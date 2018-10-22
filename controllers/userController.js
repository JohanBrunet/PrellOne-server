const User = require('../models/user');

let UserController = () => {}

UserController.getByEmail = (email) => {
    return User.findOne({'email': email});
}

UserController.getByID = (id) => {
    return User.findById(id);
}

UserController.getAll = () => {
    return User.find();
}

UserController.create = (data) => {
    const user = new User(data);
    return user.save();
}

UserController.update = (user,data) => {
    const query = {'id': user.id};
    const options = {new: true, upsert: true};
    return User.findOneAndUpdate(query, data, options);
}

module.exports = UserController;