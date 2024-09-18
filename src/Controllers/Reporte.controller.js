const { db } = require('../DataBase/firebase');
const { addDocument } = require('./Default.controller');

async function getReportesByIdCuenta(nameCollection, idCuenta) {
    const querySnapshot = await db.collection(nameCollection).where('idCuenta', '==', idCuenta).get()
    try {
        if (querySnapshot.size > 0) {
            let reportes = [];
            for (const doc of querySnapshot.docs) {
                reportes.push(doc.data());
            }
            return { status: 'success', data: reportes }
        } else {
            return { status: 'success', description: 'Sin Reportes' }
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', description: 'Error en la solicitud, por favor inténtalo más tarde' }
    }
}

async function getReportesRecientes(nameCollection, programaEdu, periodo, noTutoria) {
    const querySnapshot = await db.collection(nameCollection).where('programaEducativo', '==', programaEdu).where('periodo', '==', periodo).where('noTutoria', '==', noTutoria).get()
    try {
        if (!querySnapshot.empty) {
            const documents = querySnapshot.docs.map(doc => ({
                ...doc.data()
            }))
            return { status: 'success', data: documents }
        } else {
            return { status: 'error', description: 'Sin Reportes' }
        }
    } catch (error) {
        console.log(error);
        return { status: 'error', description: 'Error en la solicitud, por favor inténtalo más tarde' }
    }
}
async function addReporte(nameCollection, params) {
    await params.Problemas.forEach(problema => {
        addDocument("Problemas",problema)
    });
    return addDocument(nameCollection,params)
}

module.exports = {
    getReportesByIdCuenta,
    getReportesRecientes,
}