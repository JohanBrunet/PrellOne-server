const Card = require('../models/card');
const UserController = require('./userController')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let CardController = () => {}

CardController.getByID = (id) => {
    return Card.findById(id).populate('members')
                             .populate('labels')
}

CardController.getAll = () => {
    return Card.find();
}

module.exports = CardController;