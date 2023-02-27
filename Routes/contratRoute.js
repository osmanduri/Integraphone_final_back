const router = require('express').Router();
const contratController = require('../Controllers/contratController');
const verify = require('./utils/verifyToken');

router.get('/', verify.verifyAdmin, contratController.getAllContrat);
router.get('/users/:id', verify.verifyUser, contratController.getContratByUser);
router.get('/date/:type', verify.verifyUser, contratController.getContratByType);


module.exports = router