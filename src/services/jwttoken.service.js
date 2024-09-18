const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET
const ClaimTypes = require('../config/claimtypes')


const GeneraToken = (email, nombre, rol) => {
    //Utilizamos los nombre de Claims estandar
    const token = jwt.sign({
        [ClaimTypes.Email]: email,
        [ClaimTypes.Name]: nombre,
        [ClaimTypes.Role]: rol,
        "iss": "ServidorFeiJWT",
        "aud":"ClientesFeiJWT"
    }, jwtSecret, {
        expiresIn: '20m',
    })

    return token;
}

const TiempoRestanteToken = (req) => {
    try {
        const authHeader = req.header('Authorization');
        
        if (!authHeader.startsWith('Bearer')) { 
            return null;
        }

        const token = authHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, jwtSecret);

        const time = decodedToken.exp - (new Date().getTime() / 1000);
        const minutos = Math.floor(time / 60);
        const segundos = Math.floor(time - minutos * 60);

        return "00:" + minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0');
    } catch (error) {
        console.error('Error al calcular el tiempo restante del token:', error);
        return null;
    }
}

module.exports = { GeneraToken, TiempoRestanteToken };



module.exports = { GeneraToken, TiempoRestanteToken }