const {Router} = require('express');
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const Authorize = require('../middlewares/auth.middleware')
const router = Router();

const collection = 'ProgramasEducativos'

router.get('/api/programasEducativos', Authorize('Tutor,Coordinador') , async (req, res)=>{
    res.json(await getAllDocuments(collection));
})

router.get('/api/programasEducativos/:ids', Authorize('Tutor,Coordinador') , async(req, res)=>{
    const ids = req.params.ids.split(',').map(Number);
    res.json(await getDocumentsByIds(collection, ids));
})

router.post('/api/programasEducativos', Authorize('Coordinador') , async (req, res)=>{
    res.json(await addDocument(collection, req.body));
})



module.exports = router;