const  {login,tiempo} = require('../controllers/auth.controller')
const Authorize = require('../middlewares/auth.middleware')
const {Router} = require('express');
const router = Router();

router.post('/api/auth',login)
router.get('/api/tiempo',Authorize("Tutor,Coordinador"), tiempo)

module.exports = router