const {Router} = require('express');
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const {addProblem, getProblemasByIdReporte} = require('../Controllers/Problema.controller')
const Authorize = require('../middlewares/auth.middleware')
const router = Router();

const collection = 'Problemas'

router.get('/api/problemas/', Authorize('Coordinador') , async (req,res) => {
    res.json(await getAllDocuments(collection))
})

router.get('/api/problemas/:id', Authorize('Tutor,Coordinador') , async(req, res)=>{
    res.json(await getDocumentById(collection, req.params.id.toString()))
})

// router.get('/api/problemas/byIdReporte/:id', async(req, res)=>{
//     res.json(await getProblemasByIdReporte(collection, parseInt(req.params.id)))
// })

router.post('/api/problemas/', Authorize('Coordinador'), async (req, res) =>{        
    res.json(await addDocument(collection,req.body))
})

router.put('/api/problemas/:id', Authorize('Coordinador') , async (req,res) =>{
    res.json(await updateDocument(collection, req.params.id.toString(), req.body))
})

router.delete('/api/problemas/:id', Authorize('Coordinador') , async (req, res)=>{
    res.json(await deleteDocument(collection, req.params.id.toString()))
})

module.exports = router;