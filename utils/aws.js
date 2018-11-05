const AWS = require('aws-sdk')
const uuid = require('uuid')
const throwError = require('./throwError')

// TODO: add Muter for file upload from client

// Create unique bucket name
const bucketName = process.env.AWS_S3_BUCKET_NAME

// Create new S3 connexion
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports.uploadFile = async(fileName) => {
    try {
        const fileContent = await readFile(fileName)
        const key = `${fileName}-${uuid.v4()}`
        const params = {
            Bucket: bucketName, // pass your bucket name
            Key: key, // file will be saved as <bucketName>/<fileName>
            Body: JSON.stringify(fileContent, null, 4)
        };
        const uploaded = await s3.upload(params).promise()
        console.log(`File uploaded successfully at ${uploaded.Key}`)
        return uploaded.Key
    } 
    catch (error) {
        throwError(500, error.message)
    }
}

module.exports.uploadProfilePicture = async(fileName, fileContent, directory = null) => {
    try {
        const bucket = directory ? `${bucketName}/${directory}` : bucketName
        const [name, extension] = fileName.split(".")
        const key = `${name}-${uuid.v4()}.${extension}`
        console.log(key)
        const params = {
            Bucket: bucket, // pass your bucket name
            Key: key, // file will be saved as <bucketName>/<fileName>
            ACL: "public-read", // for the picture to be accessible via URL
            Body: JSON.stringify(fileContent, null, 4)
        };
        const uploaded = await s3.upload(params).promise()
        console.log(`File uploaded successfully at ${uploaded.Location}`)
        return uploaded.Location
    } 
    catch (error) {
        throwError(500, error.message)
    }
}