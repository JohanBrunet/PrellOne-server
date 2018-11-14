const List = require('../models/list');
const BoardController = require('./boardController')
const mongoose = require('mongoose')
const throwError = require('../utils/throwError')

let ListController = () => {}

ListController.getById = async(id) => {
    return await List.findById(id).populate('cards')
                                  .populate('labels')
                                  .populate('users')
}

ListController.getAll = async(boardId) => {
    return await List.find({board: boardId}).populate('cards')
                                      .populate('labels')
}

ListController.getAll = async() => {
    return await List.find().populate('cards')
                            .populate('labels')
}

ListController.create = async(listData,boardId) => {
    try {
        const newList = new List(listData)
        await BoardController.addList(boardId, newList.id)
        list=await newList.save()
        const io=require('../index').io
        io.to(boardId).emit("action",{type:"LIST_ADDED_SUCCESS",
        list:list})
        return list
    }
    catch(error) {
        throwError(500, error)
    }
}

ListController.update = async (list) => {
    const query = {'_id': list.id}
    const options = {new: true, upsert: true}
    const newList = await List.findOneAndUpdate(query, list, options)  
    const io=require('../index').io
        io.to(newList.board).emit("action",{type:"LIST_UPDATED_SUCCESS",
        list:newList})
    return newList
}

ListController.addCard = async(listId, cardId) => {
    const query = {_id: listId}
    const update = {
        $push: {
            cards: cardId
        } 
    }
    const options = {new: true, upsert: true}
    const newList= await List.findByIdAndUpdate(query, update, options)
    return newList
}

module.exports = ListController;