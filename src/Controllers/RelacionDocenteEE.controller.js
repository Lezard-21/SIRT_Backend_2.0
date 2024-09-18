const {db} = require('../DataBase/firebase');

const {addDocument, updateDocument} = require('../Controllers/Default.controller')

const nameCollection = "RelacionDocentesEE";

async function getDocentesByIdEE(idEE) {
    try {        
        const querySnapshot = await db.collection(nameCollection).where('idEE', '==', idEE).get()        
        if (!querySnapshot.empty) {
            const idsDocentes = querySnapshot.docs[0].data().idsDocentes
            const queryDocentes = await db.collection("Docentes").where("id","in",idsDocentes).get()
            if(!queryDocentes.empty){
                const documents = queryDocentes.docs.map(doc=>({            
                    ...doc.data()
                }))
                return {
                    status: 'success', 
                    data:documents
                }                
            }else{
                return{
                    status: "success",
                    data: []
                }
            }            
        }else{
            return{
                status: "error",
                description: "No sé encontró ningún registro"
            }
        }        
    } catch (error) {
        return {
            status: "error",
            description: error.message || error
        }
    }
}

async function createOrUpdateRelacionDocente(idEE, body) {
    try {
        const query = await db.collection(nameCollection).where("idEE","==",idEE).get()
        if(!query.empty){
            await db.collection(nameCollection).doc(query.docs[0].id).update(body)
            return {status:"success", description:"Experiencia Educativa actualizada con éxito"}
        }else{
            return await addDocument(nameCollection,body)
        }
    } catch (error) {
        
    }
}

module.exports = {
    getDocentesByIdEE,
    createOrUpdateRelacionDocente
}