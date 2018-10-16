const User = require('../models/user');

class UserController {

    getByEmail(email) {
        return User.find({'email': email});
    }
    
    getByID(id) {
        return User.findById(id);
    }

    getAll() {
        return User.find();
    }
    
    create(data) {
        const newUser = new User(data);
        return newUser.save();
    }
    
    update(user,data) {
        const query = {'id': user.id};
        const options = {new: true, upsert: true};
        return User.findOneAndUpdate(query, data, options);
    }

}

module.exports = UserController;