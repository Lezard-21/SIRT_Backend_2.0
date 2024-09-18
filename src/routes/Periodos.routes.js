const {Router} = require('express');
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttributes ,getUltimateKey, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const Authorization = require('../middlewares/auth.middleware');
const router = Router();

const collection  = "Periodos"

router.get("/api/periodos/", Authorization("Tutor,Coordinador"), async (req, res) => {
    res.json(await getAllDocuments(collection))
})

router.get("/api/periodos/byEstado/:estado", Authorization("Tutor,Coordinador"), async (req, res) => {
    const estado = { estado: req.params.estado}
    res.json(await getDocumentsByAttributes(collection,estado))
})

router.post("/api/periodos/", Authorization("Tutor,Coordinador"), async (req,res) => {
    res.json(await addDocument(collection, req.body))
})

module.exports = router