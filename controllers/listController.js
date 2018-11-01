const List = require('../models/List');
const BoardController = require('./boardController')
const throwError = require('../utils/throwError')

let ListController = () => {}

ListController.getByID = (id) => {
    return List.findById(id).populate('cards')
}

ListController.getAll = () => {
    return Board.find();
}

ListController.create = async(listData, session = null) => {
    if(!listData.board) throwError(400, 'No board to add the list to!')
    const list = new List(listData);
    try {
        const newList = await list.save()
        BoardController.addList(listData.board, newList.id)
        // if(teamId) TeamController.addList(teamId, newList.id)
        return newList
    }
    catch(error) {
        throw error
    }
}

ListController.update = (list, data) => {
    const query = {'id': list.id};
    const options = {new: true, upsert: true};
    return List.findOneAndUpdate(query, data, options);
}

ListController.addCard = (listId, cardId) => {
    const update = { 
        $push: {
            cards: cardId
        } 
    }
    const options = {new: true, upsert: true};
    return List.findByIdAndUpdate(listId, update, options);
}

module.exports = ListController;