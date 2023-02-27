const router = require('express').Router();
const offresCoefficientController = require('../Controllers/offresCoefficientController')
const verify = require('./utils/verifyToken');

router.get('/:id', offresCoefficientController.getAllCoefficient);
router.post('/new',verify.verifySuperAdmin,  offresCoefficientController.postCoefficient);
router.put('/update/ftto/:id',verify.verifySuperAdmin, offresCoefficientController.updateCoefficientFTTO);
router.put('/update/ftte/:id',verify.verifySuperAdmin, offresCoefficientController.updateCoefficientFTTE);
router.put('/update/ftth/:id',verify.verifySuperAdmin, offresCoefficientController.updateCoefficientFTTH);


module.exports = router