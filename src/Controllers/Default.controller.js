const {db} = require('../DataBase/firebase');

async function getUltimateKey(nameCollection) {
    const collectionRef = db.collection(nameCollection);
    let key = 0;
    return collectionRef.orderBy('id','desc').limit(1).get()
    .then((querySnapshot)=>{
        if(querySnapshot.empty){
            return Number(key).toString()
        }else{
            key = querySnapshot.docs[0].id
            return (Number(key) + 1).toString()            
        }
    })
}

async function getAllDocuments(nameCollection){
    const querySnapshot = await db.collection(nameCollection).get()
    if(!querySnapshot.empty){
        const documents = querySnapshot.docs.map(doc=>({            
            ...doc.data()
        }))
        return {status: 'success', data:documents}
    }else{
        const message = {
            status : "error",
            description: "Error al encontar la Base de datos"
        }
        return message
    }
}

async function getDocumentById(nameCollection, idDocument) {
    const querySnapshot = await db.collection(nameCollection).doc(idDocument).get()
    if(querySnapshot.exists){
        return {status:"success", data:querySnapshot.data()}
    }else{
        const message = {
            status : "error",
            description: "El documento no fue encontrado en la base de datos"
        }
        return message
    }
}

async function getDocumentsByAttribute(nameCollection, atribute, operation, value){
    try {        
        const querySnapshot = await db.collection(nameCollection).where(atribute, operation, value).get()
        if(!querySnapshot.empty){
            const documents = querySnapshot.docs.map(doc=>({
                ...doc.data()
            }))
            return{
                status:"success",
                data:documents
            }
        }else{
            return{
                status:"error",
                description:"Sin registros"
            }
        }
    } catch (error) {
        console.log(error);   
    }
}

async function getDocumentsByAttributes(nameCollection, criteria) {
    try {
        let query = db.collection(nameCollection);

        for(const attribute in criteria){
            if(criteria.hasOwnProperty(attribute)){
                const value = criteria[attribute];
                query = query.where(attribute, '==', value)
            }
        }

        const querySnapshot = await query.get();
        if(!querySnapshot.empty){
            const documents = querySnapshot.docs.map(doc => ({
                ...doc.data()
            }));
            
            return {
                status: "success",
                data: documents
            };            
        } else {
            return {
                status: "success",
                description: "Sin registros"
            };
        }
    } catch (error) {
        console.log(error);
        return {
            status: "error",
            description: "Error en la solicitud, por favor inténtalo más tarde"
        };
    }    
}

async function getDocumentsByIds(nameCollection, ids){
    try {
        const querySnapshot = await db.collection(nameCollection).where('id', 'in', ids).get();
        if(!querySnapshot.empty){
            const documents = querySnapshot.docs.map(doc=>({
                ...doc.data()
            }))
            return{
                status:"success",
                data:documents
            }
        }else{
            return{
                status:"error",
                description:"Sin registros"
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function addDocument(nameCollection, params) {
    let key = await getUltimateKey(nameCollection)    
    params.id = parseInt(await getUltimateKey(nameCollection))
    return db.collection(nameCollection).doc(key).set(params)
    .then(()=>{
        const message = {
            status : "success",
            description: `registro de ${nameCollection} añadido`
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

async function updateDocument(nameCollection, idDocument, params){
    return db.collection(nameCollection).doc(idDocument).update(params)
    .then(()=>{
        const message = {
            status : "success",
            description: `registro de ${nameCollection} actualizado`
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

async function deleteDocument(nameCollection, idDocument){
    return db.collection(nameCollection).doc(idDocument).delete()
    .then(()=>{
        const message = {
            status : "success",
            description: `registro de ${nameCollection} eliminado`
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

module.exports = {
    getUltimateKey,
    getAllDocuments,
    getDocumentById,
    getDocumentsByAttribute,
    getDocumentsByAttributes,
    getDocumentsByIds,
    addDocument,
    deleteDocument,
    updateDocument,     
};
