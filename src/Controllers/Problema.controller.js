const {db} = require('../DataBase/firebase');
const {getUltimateKey} = require('./Default.controller')

async function addProblem(nameCollection, params, ReportCollection) {
    let key = await getUltimateKey(nameCollection)
    let id = parseInt(await getUltimateKey(nameCollection))  
    const idReporte = Number(await getUltimateKey(ReportCollection))+1
    return db.collection(nameCollection).doc(key).set({id:id, idReporte:idReporte, data:params.problemas})
    .then(()=>{
        const message = {
            status : "success",
            description: `Registro de ${nameCollection} añadido`
        }
        return message
    })
    .catch((error)=>{
        const message = {
            status : "error",
            description: error
        }
        return message
    })
}

async function getProblemasByIdReporte(nameCollection, idReporte) {    
    const querySnapshot = await db.collection(nameCollection).where('idReporte', '==', idReporte).get()
    try {
        if(querySnapshot.size > 0){
            const documents = querySnapshot.docs.map(doc=>({
                ...doc.data()
            }))
            return {status:'success', data:documents}
        }else{
            return {status:'error', description:'Sin problemas reportados'}
        }
    } catch (error) {
        console.log(error);
        return {status:'error', description:'Error en la solicitud, por favor inténtalo más tarde'}
    }
}

module.exports = {
    addProblem,
    getProblemasByIdReporte,
}