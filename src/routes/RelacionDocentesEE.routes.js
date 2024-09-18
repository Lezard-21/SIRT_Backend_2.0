const {Router} = require('express');
const router = Router();
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const {getDocentesByIdEE, createOrUpdateRelacionDocente} = require('../Controllers/RelacionDocenteEE.controller')
const Authorize = require('../middlewares/auth.middleware')

const collection = 'RelacionDocentesEE'

router.get('/api/relacionDocentesEE/', Authorize('Tutor,Coordinador') , async (req,res) => {
    res.json(await getAllDocuments(collection))
})

router.get('/api/relacionDocentesEE/:id', Authorize('Tutor,Coordinador') , async(req, res)=>{
    res.json(await getDocumentById(collection, req.params.id.toString()))
})

router.get('/api/relacionDocentesEE/ByIdEE/:idEE', Authorize('Tutor,Coordinador') , async(req, res)=>{
    req.params.idEE = parseInt(req.params.idEE)
    res.json(await getDocentesByIdEE(req.params.idEE))
})

router.post('/api/relacionDocentesEE', Authorize('Coordinador'), async (req, res) =>{
    const{idEE} = req.body
    if(idEE){       
        req.body.idEE = parseInt(req.body.idEE)    
        res.json(await addDocument(collection, req.body))
    }else{
        res.status(400).json({status:"error", description:"parametros incompletos o vacíos"})    
    }   
    
})

router.put('/api/relacionDocentesEE/:idEE', Authorize('Coordinador') , async (req,res) =>{
    req.params.idEE = parseInt(req.params.idEE);    
    if(req.params.idEE){               
        res.json(await createOrUpdateRelacionDocente(req.params.idEE,req.body))
    }else{
        res.status(400).json({status:"error", description:"parametros incompletos o vacíos"})
    }        
})

router.delete('/api/relacionDocentesEE/:id', Authorize('Coordinador') , async (req, res)=>{
    res.json(await deleteDocument(collection, req.params.id.toString()))
})
module.exports = router