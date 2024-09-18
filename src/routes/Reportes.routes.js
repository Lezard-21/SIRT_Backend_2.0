const {Router} = require('express');
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttributes ,getUltimateKey} = require('../Controllers/Default.controller')
const {getReportesByIdCuenta, getReportesRecientes} = require('../Controllers/Reporte.controller')
const Authorization = require('../middlewares/auth.middleware')
const router = Router();

const collection = 'Reportes'

router.get('/api/reportes/', Authorization('Tutor,Coordinador'), async (req,res) => {    
    res.json(await getAllDocuments(collection))
})

router.get('/api/reportes/ultimate', Authorization('Tutor,Coordinador') , async (req, res) =>{
    res.json({id: parseInt(await getUltimateKey(collection))})
})

router.get('/api/reportes/:id', Authorization('Tutor,Coordinador') , async(req, res)=>{
    res.json(await getDocumentById(collection, req.params.id.toString()))
})

router.get('/api/reportes/byIdCuenta/:idCuenta', Authorization('Tutor,Coordinador') , async(req, res)=>{
    res.json(await getReportesByIdCuenta(collection, parseInt(req.params.idCuenta)))
})

router.get('/api/reportes/byAttributes/:idCuenta/:periodo/:programaEducativo', Authorization('Tutor,Coordinador') , async (req, res)=>{            
    req.params.idCuenta = parseInt(req.params.idCuenta)
    const {idCuenta, periodo, programaEducativo} = req.params;    
    const criteria = {
        idCuenta: idCuenta,
        Periodo: periodo,
        ProgramaEducativo: programaEducativo
    }
    
    res.json(await getDocumentsByAttributes(collection,criteria));
})

router.post('/api/reportes/recientes', Authorization('Coordinador,Tutor') , async (req, res) =>{
    req.body.noTutoria = parseInt(req.body.noTutoria)
    res.json (await getReportesRecientes(collection,req.body.programaEdu,req.body.periodo,req.body.noTutoria))
})

router.post('/api/reportes/', Authorization('Coordinador,Tutor') , async (req, res) =>{
    const idReporte = parseInt(await getUltimateKey(collection));
for (const problema of req.body.Problemas) {
        problema.idReporte = idReporte;
        addDocument('Problemas', problema);
        problema.idProblema = parseInt( await getUltimateKey('Problemas'))
    }
    res.json(await addDocument(collection, req.body))
})

router.put('/api/reportes/:id', Authorization('Coordinador,Tutor') , async (req,res) =>{
    console.log(req.body)
    for(const problema of req.body.Problemas){
        console.log(problema)
        await updateDocument('Problemas',String.toString(problema.id),problema)
    }
    res.json(await updateDocument(collection, req.params.id, req.body))
})

router.delete('/api/reportes/:id', Authorization('Coordinador') , async (req, res)=>{
    res.json(await deleteDocument(collection, req.params.id.toString()))
})

module.exports = router;