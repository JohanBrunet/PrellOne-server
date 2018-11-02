const fs = require('fs')
const mongoose = require('mongoose')

const dirpath = './models'

module.exports.initDB = async () => {
    fs.readdir(dirpath, async(err, files) => {
        for (const file of files) {
            const fileName = file.replace('.js', '')
            const collections = await mongoose.connection.db.listCollections().toArray()
            const collectionsNames = collections.map( col => col.name )
            if(!collectionsNames.includes(fileName + 's')) {
                try {
                    const model = require(`.${dirpath}/${fileName}`)
                    await model.createCollection()
                    console.log(`Collection ${fileName.charAt(0).toUpperCase()}${fileName.substr(1)} created`)
                }
                catch(e) {
                    console.error(`Error creating collection ${fileName.charAt(0).toUpperCase()}${fileName.substr(1)}`)
                }
            }
        }
        // if (process.env.NODE_ENV != 'production') {
        //     await seedCollections()
        //     console.log(`The database has been seeded`)
        // }
    })
}

seedCollections = async() => {
    user1 = {
        userName: 'medihebfaiza',
        firstName: 'Mohamed Iheb',
        lastName: 'FAIZA',
        profilePicture: 'https://avatars1.githubusercontent.com/u/22474480?s=460&v=4'
    },
    user2 = {
        userName: 'marion-rul',
        firstName: 'Marion',
        lastName: 'RUL',
        profilePicture: 'https://bit.ly/2yHma2e'
    }

    board1 = {
        title: 'First Board',
        lists: ['list1','list2','list3']
    },
    board2 = {
        title: 'Marion Board',
        lists: ['list1']
    }
}



// const demoData = {
//     
//     cards: {
//         'task1': {
//             id: 'task1', 
//             index: 0,
//             title:'Make the report',
//             description: 'You need to make the report in English',
//             memberIds: ['user1','user2'],
//             labelIds: ['label1','label2'],
//             comments: [
//                 {
//                     id: 'comment1',
//                     content: 'This should be easy to do !',
//                     userId: 'user1'
//                 },
//                 {
//                     id: 'comment2',
//                     content: 'Yes !',
//                     userId: 'user2'
//                 },
//             ],
//             dueDate: '2018-11-01T18:00:00+01:00',
//             creation_date: null
//         },
//         'task2': {
//             id: 'task2',
//             index: 1, 
//             title:'Make the presentation',
//             description: 'You need to make the presentation in English',
//             membersIds: [],
//             labelIds: ['label1','label2'],
//             comments: [],
//             dueDate: '2018-11-03T18:00:00+01:00',
//             creation_date: null
//         },
//         'task3': {
//             id: 'task3',
//             index: 0, 
//             title:'Add a list on board',
//             description: 'You need to add a list on board with a button. The button stays in the right of the board.',
//             members: [],
//             labelIds: ['label1','label2'],
//             comments: [],
//             dueDate: '2018-11-15T18:00:00+01:00',
//             creation_date: null
//         },
//         'task4': {
//             id: 'task4',
//             index: 1, 
//             title:'Add a card on list',
//             description: '',
//             membersIds: [],
//             labelIds: ['label4','label2','label1'],
//             comments: [],
//             dueDate: '2018-11-01T18:00:00+01:00',
//             creation_date: null
//         },
//         'task5': {
//             id: 'task5',
//             index: 0, 
//             title:'Make the tests',
//             description: '',
//             membersIds: [],
//             labelIds: [],
//             comments: [],
//             dueDate: '2018-11-01T18:00:00+01:00',
//             creation_date: null
//         },
//         'task6': {
//             id: 'task6',
//             index: 1, 
//             title:'Read the documentation',
//             description: '',
//             membersIds: [],
//             labelIds: ['label1'],
//             comments: [],
//             dueDate: '2018-11-01T18:00:00+01:00',
//             creation_date: null
//         },
//         'task7': {
//             id: 'task7',
//             index: 2, 
//             title:'Read the courses',
//             description: '',
//             membersIds: [],
//             labelIds: ['label1','label3'],
//             comments: [],
//             dueDate: '2018-11-01T18:00:00+01:00',
//             creation_date: null
//         }
//     },
//     lists: {
//         'list1': {
//             id: 'list1',
//             title:'Todo',
//             cardIds: ['task1', 'task2'],
//             toggleAddCard: false
//         },
//         'list2': {
//             id: 'list2',
//             title:'In progress',
//             cardIds: ['task3', 'task4'],
//             toggleAddCard: false
//         },
//         'list3': {
//             id: 'list3',
//             title:'Done',
//             cardIds: ['task5', 'task6', 'task7'],
//             toggleAddCard: false
//         }
//     },
//     labels: {
//         'label1': {
//             id: 'label1',
//             title: 'Optional',
//             color: 'primary'
//         },
//         'label2': {
//             id: 'label2',
//             title: 'Low',
//             color: 'success'
//         },
//         'label3': {
//             id: 'label3',
//             title: 'Urgent',
//             color: 'danger'
//         },
//         'label4': {
//             id: 'label4',
//             title: 'Important',
//             color: 'warning'
//         }
//     },
//     boards: {

//     },
//     home: ['board1','board2']
// }

// export default demoData;