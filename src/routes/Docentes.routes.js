const {Router} = require('express');
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const Authorize = require('../middlewares/auth.middleware')
const router = Router();

const collection = 'Docentes'

router.get('/api/docentes', Authorize('Tutor,Coordinador'), async (req,res) => {
    res.json(await getAllDocuments(collection))
})

router.get('/api/docentes/:id', Authorize('Tutor,Coordinador'), async(req, res)=>{
    res.json(await getDocumentById(collection, req.params.id.toString()))
})

router.get('/api/docentes/byProgramaEdu/:programaEdu', Authorize('Tutor,Coordinador'), async(req, res)=>{
    const query = await getDocumentsByAttribute(collection,"programaEdu","==",req.params.programaEdu)
    console.log(query)
    if(query.status === "success"){
        res.json( {status: query.status, data: query.data.sort((a, b) => a.nombre.localeCompare(b.nombre))})
    }else{
        res.json( {status: query.status, description: query.description})
    }
})

router.post('/api/docentes/', Authorize('Coordinador'), async (req, res) =>{    
    res.json(await addDocument(collection, req.body))
})

router.put('/api/docentes/:id', Authorize('Coordinador'), async (req,res) =>{    
    res.json(await updateDocument(collection, req.params.id.toString(), req.body))
})

router.delete('/api/docentes/:id', Authorize('Coordinador'), async (req, res)=>{
    res.json(await deleteDocument(collection, req.params.id.toString()))
})

module.exports = router;