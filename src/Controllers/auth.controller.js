const bcrypt = require('bcrypt');
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service');
const { db } = require('../DataBase/firebase');


async function login(req, res){
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
        }

        const userSnapshot = await db.collection('Cuentas').where('correo', '==', correo).limit(1).get();
        
        if (userSnapshot.empty) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectas.' });
        }

        const userDoc = userSnapshot.docs[0];
        const data = userDoc.data();

        const passwordMatch = await bcrypt.compare(password, data.contrasenia);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectas.' });
        }

        const token = GeneraToken(data.correo, data.nombre, data.rol);

        return res.status(200).json({
            idCuenta: data.id,
            email: data.correo,
            nombre: data.nombre,
            rol: data.rol,
            programaEdu: data.programaEdu,
            jwt: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}


// GET api/auth/tiempo
async function tiempo(req, res) {
    const tiempo = TiempoRestanteToken(req);
    if (tiempo == null) {
        return res.status(401).send();
    }
    return res.status(200).send(tiempo);
}

module.exports = {
    login,
    tiempo
};
