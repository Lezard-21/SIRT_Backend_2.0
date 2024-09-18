const errorHandler = (err, req, res, next) => {
    let mensaje = 'No se ha podido procesar la petición. Inténtelo nuevamente más tarde.'
    if (process.env.NODE_ENV === 'development') {
        const statusCode = err.statusCode || 400
        mensaje = err.message || mensaje
        return res.status(statusCode).json({
            success: false,
            status: err.statusCode,
            mensaje: mensaje,
            stack: err.stack
        })
    }
    return res.status(400).send({ mensaje: mensaje })
}
module.exports = errorHandler