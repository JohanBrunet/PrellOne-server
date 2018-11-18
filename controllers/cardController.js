const Card = require('../models/card');
const UserController = require('./userController')
const ListController=require('./listController')
const throwError = require('../utils/throwError')

let CardController = () => {}

/*GET CARD BY ID*/
CardController.getById = async(id) => {
    return await Card.findById(id).populate('members')
                                
}

/*GET ALL CARD*/
CardController.getAll = async() => {
    return await Card.find();
}

/*UPDATE A CARD*/
CardController.update = async(card) => {
    const query = {'_id': card.id}
    const options = {new: true, upsert: true}
    const newCard= await Card.findOneAndUpdate(query, card, options)
    const io=require('../index').io
        io.to(newCard.board).emit("action",{type:"CARD_UPDATED_SUCCESS",
        card:newCard})
    return newCard
}

/*CREATE A CARD*/
CardController.create = async(cardData,listId) => {
    try {
        const newCard = new Card(cardData)
        newCard.description="Enter your description here"
        await ListController.addCard(listId, newCard.id)
        const card=await newCard.save()
        const io=require('../index').io
        io.to(cardData.board).emit("action",{type:"CARD_ADDED_SUCCESS",
        card:card})
        return card
    }
    catch(error) {
        throwError(500, error)
    }
}

/*UPDATE DESC CARD*/
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

/*ADD MEMBER CARD*/
CardController.addMember= async (cardId, username) => {
    const query = {_id: cardId}
    const member = await UserController.getByUsername(username)
    if (!member){
        throwError(404, "Member with username not found")
    }
    else {
        const update = {
            $addToSet: {
                members: member._id
            } 
        }
        const options = {new: true, upsert: true}
        const newCard = await Card.findByIdAndUpdate(query, update, options)
        return member
    }
}

/*ADD FILE CARD*/
CardController.addFile = async (cardId, name, url) => {
    const query = {'_id': cardId}
    const update = {
        $addToSet: {
            attachments: {
                name: name,
                owner: null,
                size: 0,
                pos: 0,
                url: url
            }
        } 
    }
    const options = {new: true, upsert: true}
    const newCard = await Card.findOneAndUpdate(query, update, options)
    const io=require('../index').io
        io.to(newCard.board).emit("action",{type:"CARD_UPDATED_SUCCESS",
        card: newCard})
    return newCard
}

module.exports = CardController;