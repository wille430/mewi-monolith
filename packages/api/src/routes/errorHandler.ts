export default (error, req, res, next) => {
    console.error('ENCOUNTERED AN ERROR:', error)
    res.status(error.status || 500).json({
        error: error,
    })
}
