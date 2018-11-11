const Card = require('../models/card');
const UserController = require('./userController')
const ListController=require('./listController')
const throwError = require('../utils/throwError')

let CardController = () => {}

CardController.getById = async(id) => {
    return await Card.findById(id).populate('members')
                                
}

CardController.getAll = async() => {
    return await Card.find();
}

CardController.update = (card) => {
    const query = {'_id': card.id}
    const options = {new: true, upsert: true}
    return Card.findOneAndUpdate(query, card, options)
}

CardController.create = async(cardData,listId) => {
    try {
        const newCard = new Card(cardData)
        await ListController.addCard(listId, newCard.id)
        const card=await newCard.save()
        console.log(cardData.board)
        const io=require('../index').io
        io.to(cardData.board).emit("action",{type:"CARD_ADDED_SUCCESS",
        card:card})
        return card
    }
    catch(error) {
        throwError(500, error)
    }
}

CardController.updateDesc=(desc,cardId)=>{
    const query = {_id: cardId}
    const update = {
        $set: {
            description: desc
        } 
    }
    const options = {new: true, upsert: true}
    return Card.findByIdAndUpdate(query, update, options)
}

CardController.addMember=(userId,cardId)=>{
    const query = {_id: cardId}
    const update = {
        $push: {
            members: userId
        } 
    }
    const options = {new: true, upsert: true}
    return Card.findByIdAndUpdate(query, update, options)
}
module.exports = CardController;