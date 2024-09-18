const {db} = require('../DataBase/firebase');

const { getDocumentsByAttribute, updateDocument, addDocument } = require('./Default.controller');

async function getTutoriaActive(nameCollection, programaEdu) {
    try {
        const querySnapshot = await db.collection(nameCollection).where("estado","==","Activada").where("programaEdu","==",programaEdu).get()
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
                status:"empty",
                description:"Sin registros"
            }
        }
    } catch (error) {
        return{
            status:"error",
            description:"Error en la peticion"
        }
    }
}

async function disabledTutoria(nameCollection, programaEdu, id) {
    console.log(nameCollection, programaEdu);
    try {
        const querySnapshot = await db.collection(nameCollection).where("estado","==","Activada").where("programaEdu","==",programaEdu).get();
        if(!querySnapshot.empty){
            console.log("Entra");
            const batch = db.batch();
            const docRef = db.collection(nameCollection).doc(id.toString());
            batch.update(docRef,{estado:"Desactivada"})
            await batch.commit();
            return{
                status: "success",
                description: "Tutoría desactivada con éxito"
            }            
        }else{
            console.log("no entra");
            return{
                status:"error",
                description:"error en la petición"
            }
        }
    } catch (error) {
        console.log(error);
        return{
            status:"error",
            description:"Error en la peticion"
        }
    }
}

async function agregarTutoriaAlPeriodo( abreviacion, nuevaTutoria ) {
    try {
        const response = await getDocumentsByAttribute('Periodos', 'abreviacion', '==', abreviacion);

        if (response.status === 'success' && response.data.length > 0) {
            const periodo = response.data[0];
            const periodoId = periodo.id + "";

            const tutoriasActualizadas = [...periodo.Tutorias, nuevaTutoria];
            const updateResponse = await updateDocument('Periodos', periodoId, { Tutorias: tutoriasActualizadas });
            if (updateResponse.status === 'success') {
                
                const tutoriaResponse = await addDocument('Tutoria', nuevaTutoria);

                if (tutoriaResponse.status === 'success') {
                    return { 
                        status: 'success', 
                        description: 'Tutoria agregada al periodo y registrada en la colección de tutorías' 
                    }
                } else {
                    return { 
                        status: 'error', 
                        description: 'Tutoria agregada al periodo, pero ocurrió un error al registrar en la colección de tutorías' 
                    }
                }

            } else {
                return { status: 'error', description: 'Error al actualizar el periodo' }
            }
        } else {
            return { status: 'error', description: 'Periodo no encontrado' }
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', description: 'Error en la solicitud' }
    }
};

async function actualizarTutoriaYPeriodo( abreviacion, tutoriaId, numTutoria, datosActualizados ) {
    try {
        // 1. Buscar el periodo por la abreviación
        const response = await getDocumentsByAttribute('Periodos', 'abreviacion', '==', abreviacion);

        if (response.status === 'success' && response.data.length > 0) {
            const periodo = response.data[0];  // Suponemos que solo hay un periodo por abreviación
            const periodoId = periodo.id;

            // 2. Actualizar la tutoría en la colección "Tutoria"
            const updateTutoriaResponse = await updateDocument('Tutoria', tutoriaId, datosActualizados);

            if (updateTutoriaResponse.status === 'success') {
                
                // 3. Actualizar la tutoría dentro del array del periodo
                const tutoriasActualizadas = periodo.Tutorias.map(tutoria => 
                    tutoria.numTutoria === numTutoria ? { ...tutoria, ...datosActualizados } : tutoria
                );

                // 4. Actualizar el documento del periodo con las tutorías actualizadas
                const updatePeriodoResponse = await updateDocument('Periodos', periodoId, { Tutorias: tutoriasActualizadas });

                if (updatePeriodoResponse.status === 'success') {
                    return { 
                        status: 'success', 
                        description: 'Tutoría actualizada tanto en la colección de tutorías como en el periodo' 
                    }
                } else {
                    return { 
                        status: 'error', 
                        description: 'Tutoría actualizada, pero ocurrió un error al actualizar el periodo' 
                    }
                }
            } else {
                return { status: 'error', description: 'Error al actualizar la tutoría en la colección de tutorías' };
            }
        } else {
            return { status: 'error', description: 'Periodo no encontrado' };
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', description: 'Error en la solicitud' };
    }
};


module.exports = {
    getTutoriaActive,
    disabledTutoria,
    agregarTutoriaAlPeriodo,
    actualizarTutoriaYPeriodo
}