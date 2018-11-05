const fs = require('fs')
const mongoose = require('mongoose')
const authMiddleware = require('../middlewares/authMiddleware');

const dirpath = './models'

let models = []

module.exports.initDB = async () => {
    fs.readdir(dirpath, async(err, files) => {
        for (let file of files) {
            const fileName = file.replace('.js', '')
            const collections = await mongoose.connection.db.listCollections().toArray()
            const collectionsNames = collections.map( col => col.name )
            if(!collectionsNames.includes(fileName + 's')) {
                try {
                    const model = require(`.${dirpath}/${fileName}`)
                    models[fileName] = model
                    await model.createCollection()
                    console.log(`Collection ${fileName.charAt(0).toUpperCase()}${fileName.substr(1)} created`)
                }
                catch(e) {
                    console.error(`Error creating collection ${fileName.charAt(0).toUpperCase()}${fileName.substr(1)}`)
                }
            }
        }
        if (process.env.NODE_ENV != 'production' && Object.keys(models).length) {
            try {
                await seedCollections(models)
                console.log(`The database has been seeded`)
            }
            catch(error) {
                console.error("Seeding database failed")
            }
        }
    })
}

seedCollections = async() => {

    console.log('Seeding database...')

    /**
     * Create [u1._id, u2._id]
     */
    user1pwd = await authMiddleware.hashPassword("faiza")
    user1 = {
        firstName: 'Mohamed Iheb',
        lastName: 'FAIZA',
        username: 'medihebfaiza',
        email: "iheb@prellone.com",
        password: user1pwd,
        profilePicture: 'https://avatars1.githubusercontent.com/u/22474480?s=460&v=4'
    },
    user2pwd = await authMiddleware.hashPassword("rul")
    user2 = {
        firstName: 'Marion',
        lastName: 'RUL',
        username: 'marion-rul',
        email: "marion@prellone.com",
        password: user2pwd,
        profilePicture: 'https://bit.ly/2yHma2e'
    }
    user3pwd = await authMiddleware.hashPassword("user")
    user3 = {
        firstName: 'User',
        lastName: 'USER',
        username: 'username',
        email: "user@prellone.com",
        password: user3pwd,
        profilePicture: 'https://prellone.s3.amazonaws.com/johan/lapin-c2b35fd3-1d16-4572-88ca-cfcbad6d17c2.jpeg'
    }

    const [u1, u2] = await models.user.insertMany([user1, user2])
    console.log("Users created")

    /**
     * Create boards
     */
    board1 = {
        title: 'First Board',
        members: [u1._id, u2._id],
        owner: u1._id
    },
    board2 = {
        title: 'Marion Board',
        members: [u1._id, u2._id],
        owner: u2._id
    }

    const [b1, b2] = await models.board.insertMany([board1, board2])
    console.log("Boards created")
    await models.user.findOneAndUpdate({id: u1._id}, { $push: {boards: {$each: [b1._id, b2._id]} } })
    await models.user.findOneAndUpdate({id: u2._id}, { $push: {boards: {$each: [b1._id, b2._id]} } })

    /**
     * Create lists
     */
    list1 = {
        title:'Todo',
        board: b1._id,
    },
    list2 = {
        title:'In progress',
        board: b1._id,
    },
    list3 = {
        title:'Done',
        board: b2._id,
    }

    const [li1, li2, li3] = await models.list.insertMany([list1, list2, list3])
    console.log("Lists created")
    await models.board.findOneAndUpdate({id: b1._id}, { $push: {lists: {$each: [li1._id, li2._id]} } })
    await models.board.findOneAndUpdate({id: b2._id}, { $push: {lists: li3._id } })

    /**
     * Create labels board 1
     */
    label1board1 = {
        title: 'Optional',
        board: b1._id,
        color: 'primary'
    }
    label2board1 = {
        title: 'Low',
        board: b1._id,
        color: 'success'
    }
    label3board1 = {
        title: 'Urgent',
        board: b1._id,
        color: 'danger'
    }
    label4board1 = {
        title: 'Important',
        board: b1._id,
        color: 'warning'
    }
    const [l1b1, l2b1, l3b1, l4b1] = await models.label.insertMany([label1board1, label2board1, label3board1, label4board1])
    console.log("Labels board1 created")
    
    label1board2 = {
        title: 'Optional',
        board: b2._id,
        color: 'primary'
    }
    label2board2 = {
        title: 'Low',
        board: b2._id,
        color: 'success'
    }
    label3board2 = {
        board: b2._id,
        color: 'danger'
    }
    label4board2 = {
        title: 'Important',
        board: b2._id,
        color: 'warning'
    }
    const [l1b2, l2b2, l3b2, l4b2] = await models.label.insertMany([label1board2, label2board2, label3board2, label4board2])
    console.log("Labels board2 created")

    await models.board.findOneAndUpdate({id: b1._id}, { $push: {labels: {$each: [l1b1._id, l2b1._id, l3b1._id, l4b1._id]} } })
    await models.board.findOneAndUpdate({id: b2._id}, { $push: {labels: {$each: [l1b2._id, l2b2._id, l3b2._id, l4b2._id]} } })

    /**
     * Create cards
     */
    card1 = {
        title:'Make the report',
        description: 'You need to make the report in English',
        board: b1._id,
        list: li1._id,
        members: [u1._id, u2._id],
        labels: [l1b1._id, l2b1._id],
        comments: [{
            content: 'This should be easy to do !',
            writer: u1._id
        },
        {
            content: 'Yes !',
            writer: u2._id
        }],
        dueDate: '2018-11-01T18:00:00+01:00'
    }
    card2 = {
        title:'Make the presentation',
        description: 'You need to make the presentation in English',
        board: b1._id,
        list: li1._id,
        labels: [l1b1._id, l2b1._id]
    },
    card3 = { 
        title:'Add a list on board',
        description: 'You need to add a list on board with a button. The button stays in the right of the board.',
        board: b1._id,
        list: li2.id,
        labels: [l1b1._id, l2b1._id],
        dueDate: '2018-11-15T18:00:00+01:00'
    },
    card4 = { 
        title:'Add a card on list',
        board: b1._id,
        list: li2._id,
        labels: [l4b1._id, l2b1._id, l1b1._id],
        dueDate: '2018-11-01T18:00:00+01:00'
    },
    card5 = { 
        title:'Make the tests',
        board: b2._id,
        list: li3._id,
        dueDate: '2018-11-01T18:00:00+01:00'
    },
    card6 = {
        title:'Read the documentation',
        board: b2._id,
        list: li3._id,
        labels: [l1b2._id],
        dueDate: '2018-11-01T18:00:00+01:00'
    },
    card7 = { 
        title:'Read the courses',
        board: b2._id,
        list: li3._id,
        labels: [l1b2._id, l3b2._id],
        dueDate: '2018-11-01T18:00:00+01:00'
    }
    const array = [card1, card2, card3, card4, card5, card6, card7]
    const [c1, c2, c3, c4, c5, c6, c7] = await models.card.insertMany(array)
    console.log("Cards created")

    await models.list.findOneAndUpdate({id: li1._id}, { $push: {cards: {$each: [c1._id, c2._id]} } })
    await models.list.findOneAndUpdate({id: li2._id}, { $push: {cards: {$each: [c3._id, c4._id]} } })
    await models.list.findOneAndUpdate({id: li3._id}, { $push: {cards: {$each: [c5._id, c6._id, c7._id]} } })

    /**
     * Create teams
     */
    team1 = {
        name: 'lala',
        boards: [b1._id],
        amins: [u1._id],
        members: [u1._id]
    }
    team2 = {
        name: 'Teamzer',
        boards: [b1._id, b2._id],
        admins: [u2._id],
        members: [u2._id]
    }

    const [t1, t2] = await models.team.insertMany([team1, team2])
    console.log("Teams created")

    await models.user.findOneAndUpdate({id: u1._id}, { $push: {teams: t1._id } })
    await models.user.findOneAndUpdate({id: u2._id}, { $push: {teams: t2._id } })

    await models.board.findOneAndUpdate({id: b1._id}, { $push: {teams: {$each: [t1._id, t2._id]} } })
    await models.board.findOneAndUpdate({id: b2._id}, { $push: {teams: t2._id } })

}