const AWS = require('aws-sdk')
const uuid = require('uuid')
const throwError = require('./throwError')
var multer = require('multer')
var multerS3 = require('multer-s3')

// TODO: add Muter for file upload from client

// Create unique bucket name
const bucketName = process.env.AWS_S3_BUCKET_NAME

// Create new S3 connexion
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports.uploadFile = async(fileName, fileContent) => {
    try {
        const key = `${fileName}-${uuid.v4()}`
        const params = {
            Bucket: bucketName, // pass your bucket name
            Key: key, // file will be saved as <bucketName>/<fileName>
            Body: fileContent
        };
        const uploaded = await s3.upload(params).promise()
        console.log(`File uploaded successfully at ${uploaded.Key}`)
        return uploaded.Key
    } 
    catch (error) {
        throwError(500, error.message)
    }
}

module.exports.uploadFileByStream = async (req, res, callback) => {
    const s3Uploader = multer({
        storage: multerS3({
            s3: s3,
            bucket: bucketName,
            key: function (req, file, callback) {
                callback(null, file.originalname);
            },
        })
    })
    s3Uploader.single('file')(req, res, callback)
}

module.exports.uploadFileByStream = async (req, res, callback) => {
    const s3Uploader = multer({
        storage: multerS3({
            s3: s3,
            bucket: bucketName,
            key: function (req, file, callback) {
                callback(null, file.originalname);
            },
        })
    })
    s3Uploader.single('file')(req, res, callback)
}

module.exports.download = async (fileName, res, callback) => {
    console.log("Downloading from s3 the file :")
    console.log(fileName)
    let options = {
        Bucket: bucketName,
        Key: fileName
    }
    s3.getObject(options, callback)
}

module.exports.uploadProfilePicture = async(fileName, fileContent, directory = null) => {
    try {
        const bucket = directory ? `${bucketName}/${directory}` : bucketName
        const [name, extension] = fileName.split(".")
        const key = `${name}-${uuid.v4()}.${extension}`
        const params = {
            Bucket: bucket, // pass your bucket name
            Key: key, // file will be saved as <bucketName>/<fileName>
            ACL: "public-read", // for the picture to be accessible via URL
            Body: fileContent
        };
        const uploaded = await s3.upload(params).promise()
        console.log(`File uploaded successfully at ${uploaded.Location}`)
        return uploaded.Location
    } 
    catch (error) {
        throwError(500, error.message)
    }
}