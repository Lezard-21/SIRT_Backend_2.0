const {Router} = require('express');
const router = Router();
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const defController = require('../Controllers/Default.controller')
const {getTutoriaActive, disabledTutoria, agregarTutoriaAlPeriodo} = require('../Controllers/Tutoria.controller')
const Authorization = require('../middlewares/auth.middleware')

const collection = 'Tutoria'

router.get('/api/tutoria', Authorization('Tutor,Coordinador') , async (req,res) => {
    res.json(await getAllDocuments(collection))
})

router.get('/api/tutoria/:id', Authorization('Tutor,Coordinador'), async(req, res)=>{
    res.json(await getDocumentById(collection, req.params.id.toString()))
})

router.get('/api/tutoria/byProgramaEdu/:programaEdu', Authorization('Coordinador'), async (req, res)=>{
    res.json(await getTutoriaActive(collection, req.params.programaEdu))
})

router.get('/api/tutoria/all/:programaEdu', Authorization('Coordinador') , async (req, res)=>{
    res.json(await getDocumentsByAttribute(collection,"programaEdu","==",req.params.programaEdu))
})

router.post('/api/tutoria', Authorization('Coordinador') , async (req, res) =>{            
    res.json(await agregarTutoriaAlPeriodo(req.body.abreviacion, req.body.tutoria))
})

router.put('/api/tutoria/:abreviacion/:id/:numTutoria', Authorization('Coordinador') , async (req, res) =>{            
    res.json(await agregarTutoriaAlPeriodo(req.params.abreviacion, req.params.id, req.params.numTutoria , req.body.tutoria))
})

router.put('/api/tutoria/disabled', Authorization('Coordinador') , async (req,res) =>{    
    res.json(await disabledTutoria(collection, req.body.programaEdu, req.body.id));
})

router.delete('/api/tutoria/:id', Authorization('Coordinador') , async (req, res)=>{
    res.json(await deleteDocument(collection, req.params.id.toString()))
})
module.exports = router