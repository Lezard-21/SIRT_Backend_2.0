const {Router} = require('express');
const router = Router();
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const {getEEActive, putEEStatus} = require('../Controllers/ExperienciaEducativa.controller')
const Authorize = require('../middlewares/auth.middleware')

const collection = 'ExperienciasEducativas'

router.get('/api/ee/', Authorize('Tutor,Coordinador') , async (req,res) => {
    res.json(await getAllDocuments(collection))
})

router.get('/api/ee/:id', Authorize('Tutor,Coordinador') , async(req, res)=>{
    res.json(await getDocumentById(collection, req.params.id.toString()))
})

router.get('/api/ee/byProgramaEdu/:prograEdu', Authorize('Tutor,Coordinador') , async(req, res)=>{
    const data = await getDocumentsByAttribute(collection,"programaEdu", "==", req.params.prograEdu)
    if(data.status === "success"){
        res.json({status: data.status, data: data.data.sort((a, b) => a.nombre.localeCompare(b.nombre))})
    }else{
        res.json({status: data.status, description: data.description})
    }
    
})

router.get('/api/ee/active/:programaEdu', Authorize('Tutor,Coordinador') , async(req, res)=>{    
    res.json(await getEEActive(collection, req.params.programaEdu));
})

router.post('/api/ee/', Authorize('Coordinador') , async (req, res) =>{                
    res.json(await addDocument(collection, req.body))
})

router.put('/api/ee/:id', Authorize('Coordinador') , async (req,res) =>{    
    res.json(await updateDocument(collection, req.params.id.toString(), req.body))
})

router.put('/api/ee/toActivada/:ids', Authorize('Coordinador'), async (req,res) =>{    
    const ids = req.params.ids.split(',').map(Number);
    res.json(await putEEStatus(collection, ids, "Activada"));    
})

router.put('/api/ee/toDesactivada/:ids', Authorize('Coordinador'), async (req,res) =>{    
    const ids = req.params.ids.split(',').map(Number);
    res.json(await putEEStatus(collection, ids, "Desactivada"));    
})

router.delete('/api/ee/:id', Authorize('Coordinador'), async (req, res)=>{
    res.json(await deleteDocument(collection, req.params.id.toString()))
})
module.exports = router