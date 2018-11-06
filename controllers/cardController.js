const Card = require('../models/card');
const UserController = require('./userController')

let CardController = () => {}

CardController.getById = async(id) => {
    return await Card.findById(id).populate('members')
                                
}

CardController.getAll = async() => {
    return await Card.find();
}

module.exports = CardController;