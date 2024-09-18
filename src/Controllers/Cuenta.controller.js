const {db} = require('../DataBase/firebase');

async function existUser(correo) {
    const querySnapshot = await db.collection("Cuentas").where("correo","==", correo).get();
    if(querySnapshot.empty){
        return false;
    }else{
        return true;
    }
}

async function updatePassword(nameCollection, id, password) {
    try {
        const querySnapshot = await db.collection(nameCollection).where("id","==",id).get();
        if(!querySnapshot.empty){
            const batch = db.batch();
            const docRef = db.collection(nameCollection).doc(id.toString());
            batch.update(docRef,{contrasenia: password, estado:"Activada"})
            await batch.commit();
            return{
                status: "success",
                description: "Contraseña actualizada con éxito"
            }
        }else{
            return{
                status: "error",
                description: "El registro no fue encontrado"
            }
        }
    } catch (error) {
        return{
            status: "error",
            description: "Error al actualizar la contraseña en el servidor"
        }
    }
}

module.exports = {
    existUser,
    updatePassword
}