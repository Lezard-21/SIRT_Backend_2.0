const errorLogged = (err, req, res, next)=>{
    console.log(err.message)
    next(err)
}

module.exports = errorLogged