module.exports = (status, message) => {
    let error = new Error()
    error.status = status
    error.message = message
    throw error
}