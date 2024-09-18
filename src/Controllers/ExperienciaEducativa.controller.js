const {db} = require("../DataBase/firebase")

async function getEEActive (nameCollection, programaEdu){        
    try {
        const querySnapshot = await db.collection(nameCollection).where('estatus', '==', "Activada").where('programaEdu', '==', programaEdu).get()        
        if(!querySnapshot.empty){
            const documents = querySnapshot.docs.map(doc=>({            
                ...doc.data()
            }))
            return{
                status: "success",
                data: documents.sort((a, b) => a.nombre.localeCompare(b.nombre))            
            }
        }else{
            return{
                status: "error",
                description: "Sin EE Activas"
            }
        }
    } catch (error) {
        return {
            status: "error",
            description: error.message || error
        }
    }
}

async function putEEStatus(nameCollection, ids, value) {
    try {
        const querySnapshot = await db.collection(nameCollection).where('id', 'in', ids).get();
        if(!querySnapshot.empty){
            const batch = db.batch();

            querySnapshot.forEach(doc=>{
                const docRef = db.collection(nameCollection).doc(doc.id);
                batch.update(docRef, {estatus: value});
            })

            await batch.commit();

            return{
                status:"success",
                description:"Experiencias Educativas activadas"
            }
        }else{
            return{
                status:"error",
                description:"Registros no encontrados"
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getEEActive,
    putEEStatus
}