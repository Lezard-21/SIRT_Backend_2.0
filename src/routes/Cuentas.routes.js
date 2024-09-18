const {Router} = require('express');
const {getAllDocuments, getDocumentById, addDocument, deleteDocument, updateDocument, getDocumentsByAttribute} = require('../Controllers/Default.controller')
const {existUser,updatePassword} = require("../Controllers/Cuenta.controller")
const Authorize = require('../middlewares/auth.middleware')
const router = Router();

const collection = 'Cuentas'
    
router.get('/api/cuentas', Authorize('Coordinador'), async (req,res) => {
    res.json(await getAllDocuments(collection))
})

router.get('/api/cuentas/:id', Authorize('Coordinador'), async(req, res)=>{
    res.json(await getDocumentById(collection, req.params.id))
})

router.get('/api/cuentas/byRol/:rol', Authorize('Coordinador'), async(req, res)=>{
    res.json(await getDocumentsByAttribute(collection,"rol","==",req.params.rol))
})

router.post('/api/cuentas', Authorize('Coordinador'), async (req, res) =>{    
    if(await existUser(req.body.correo)){
        res.json({status:"error", description:"El correo ya está registrado"})
    }else{        
        res.json(await addDocument(collection, req.body))
    }    
})

/*router.put('/api/cuentas/:id', async (req,res) =>{        
    res.json(await updateDocument(collection, req.params.id.toString(), req.body))
})*/

router.put('/api/cuentas/', Authorize('Coordinador'), async (req,res) =>{  
    res.json(await updatePassword(collection, parseInt(req.body.id), req.body.contrasenia))
})

router.delete('/api/cuentas/:id', Authorize('Coordinador'), async (req, res)=>{
    res.json(await deleteDocument(collection, req.params.id.toString()))
})

module.exports = router;