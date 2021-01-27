module.exports = fn => {
    return async (req, res, next) => {
        try{
            await fn(req, res, next)
            next()
        }catch (e) {
            res.status(404).json({
              status: "error",
              error: e.message
            });
        }
    }
}