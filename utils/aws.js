const AWS = require('aws-sdk')
const uuid = require('uuid')
const fs = require('fs')
const util = require('util')
// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile)
const throwError = require('./throwError')

// Create unique bucket name
const bucketName = process.env.AWS_S3_BUCKET_NAME || 'prellone-' + uuid.v4()

// Create new S3 connexion
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create a bucket on S3
// module.exports.createBucket = async() => {
//     try {
//         await s3.createBucket({Bucket: bucketName}).promise()
//         console.log(`Bucket ${bucketName} successfully created`)
//         return bucketName
//     }
//     catch(error) {
//         console.error(error)
//     }
// }

module.exports.uploadFile = async(fileName) => {
    try {
        const fileContent = await readFile(fileName)
        const key = `${fileName.split('.')[0]}-${uuid.v4()}`
        const params = {
            Bucket: bucketName, // pass your bucket name
            Key: key, // file will be saved as <bucketName>/<fileName>
            Body: JSON.stringify(fileContent, null, 4)
        };
        const uploaded = await s3.upload(params).promise()
        console.log(`File uploaded successfully at ${uploaded.data.Location}`)
        return uploaded.data.Location
    } 
    catch (error) {
        throwError(500, error.message)
    }
}